import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import * as MastraTools from '@mastra/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';
import { join } from 'path';
import { registerApiRoute } from '@mastra/core/server';
import { randomUUID } from 'crypto';

dotenv.config();
const usdaKey = process.env.USDA_API_KEY;
const settings = { usdaKey };

const { createTool } = MastraTools;
const USDA_API_KEY$1 = settings.usdaKey;
if (!USDA_API_KEY$1) {
  throw new Error("USDA_API_KEY is missing from your environment variables.");
}
const foodInfoTool = createTool({
  id: "get-food-info-usda",
  description: "Fetch nutritional information, vitamins, minerals, and health benefits for any food using the USDA FoodData Central API",
  inputSchema: z.object({
    food: z.string().describe("Name of the food to look up")
  }),
  outputSchema: z.object({
    foodName: z.string(),
    calories: z.number().optional(),
    protein: z.string().optional(),
    fat: z.string().optional(),
    carbs: z.string().optional(),
    vitamins: z.array(z.string()).optional(),
    minerals: z.array(z.string()).optional(),
    healthBenefits: z.array(z.string()).optional()
  }),
  execute: async ({ context }) => {
    const query = encodeURIComponent(context.food.trim().toLowerCase());
    const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=1&api_key=${USDA_API_KEY$1}`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error(`USDA API search failed for "${context.food}"`);
    const searchData = await searchRes.json();
    if (!searchData.foods || searchData.foods.length === 0)
      throw new Error(`No USDA data found for "${context.food}"`);
    const food = searchData.foods[0];
    const nutrients = food.foodNutrients || [];
    const calories = nutrients.find((n) => n.nutrientName.toLowerCase().includes("energy"))?.value || 0;
    const protein = (nutrients.find((n) => n.nutrientName.toLowerCase().includes("protein"))?.value || 0) + " g";
    const fat = (nutrients.find((n) => n.nutrientName.toLowerCase().includes("total lipid"))?.value || 0) + " g";
    const carbs = (nutrients.find((n) => n.nutrientName.toLowerCase().includes("carbohydrate"))?.value || 0) + " g";
    const vitamins = nutrients.filter((n) => n.nutrientName.startsWith("Vitamin")).map((v) => `${v.nutrientName}: ${v.value}${v.unitName}`);
    const minerals = nutrients.filter(
      (n) => ["Iron", "Calcium", "Potassium", "Magnesium", "Zinc", "Phosphorus"].some(
        (m) => n.nutrientName.includes(m)
      )
    ).map((m) => `${m.nutrientName}: ${m.value}${m.unitName}`);
    const healthBenefits = [];
    if (calories < 50) healthBenefits.push("Low in calories, good for weight management");
    if (vitamins.find((v) => v.includes("Vitamin C")))
      healthBenefits.push("Rich in Vitamin C, supports immune system");
    if (minerals.find((m) => m.includes("Potassium")))
      healthBenefits.push("High in Potassium, supports heart health");
    if (minerals.find((m) => m.includes("Calcium")))
      healthBenefits.push("Contains Calcium, supports bone health");
    if (healthBenefits.length === 0)
      healthBenefits.push("Provides essential nutrients and energy");
    return {
      foodName: food.description,
      calories,
      protein,
      fat,
      carbs,
      vitamins: vitamins.length ? vitamins : void 0,
      minerals: minerals.length ? minerals : void 0,
      healthBenefits
    };
  }
});

const nutritionAgent = new Agent({
  name: "Nutrition Agent",
  instructions: `
    You are a helpful nutrition and health assistant.
    - Provide nutritional information and health benefits of foods.
    - Mention key vitamins, minerals, and benefits for different body systems.
    - Be concise but factual.
    - If a food name is not recognized, ask for clarification.
    - Use the foodInfoTool to fetch nutrition data.
  `,
  model: "google/gemini-2.0-flash",
  tools: { foodInfoTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: `file:${join(__dirname, "../../db/mastra.db")}`
    })
  })
});

const USDA_API_KEY = settings.usdaKey;
const foodInfoAgentRoute = registerApiRoute("/a2a/agent/food-info/:agentId", {
  method: "POST",
  handler: async (c) => {
    try {
      const mastra = c.get("mastra");
      const agentId = c.req.param("agentId");
      const body = await c.req.json();
      const { jsonrpc, id: requestId, params } = body;
      if (jsonrpc !== "2.0" || !requestId) {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestId || null,
            error: {
              code: -32600,
              message: 'Invalid Request: jsonrpc must be "2.0" and id is required'
            }
          },
          400
        );
      }
      const agent = mastra.getAgent(agentId);
      if (!agent) {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestId,
            error: {
              code: -32602,
              message: `Agent '${agentId}' not found`
            }
          },
          404
        );
      }
      const { message, messages, contextId, taskId } = params || {};
      let messagesList = [];
      if (message) messagesList = [message];
      else if (messages && Array.isArray(messages)) messagesList = messages;
      const mastraMessages = messagesList.map((msg) => ({
        role: msg.role,
        content: msg.parts?.map(
          (part) => part.kind === "text" ? part.text : part.kind === "data" ? JSON.stringify(part.data) : ""
        ).join("\n") || ""
      }));
      const response = await agent.generate(mastraMessages, async () => {
        const query = messagesList[0]?.parts?.[0]?.text || "apple";
        const encodedQuery = encodeURIComponent(query);
        const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodedQuery}&pageSize=1&api_key=${USDA_API_KEY}`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        if (!searchData.foods?.[0])
          throw new Error(`No results found for "${query}"`);
        const food = searchData.foods[0];
        const nutrients = food.foodNutrients || [];
        const calories = nutrients.find(
          (n) => n.nutrientName.toLowerCase().includes("energy")
        )?.value || 0;
        const protein = (nutrients.find(
          (n) => n.nutrientName.toLowerCase().includes("protein")
        )?.value || 0) + " g";
        const fat = (nutrients.find(
          (n) => n.nutrientName.toLowerCase().includes("total lipid")
        )?.value || 0) + " g";
        const carbs = (nutrients.find(
          (n) => n.nutrientName.toLowerCase().includes("carbohydrate")
        )?.value || 0) + " g";
        const vitamins = nutrients.filter((n) => n.nutrientName.startsWith("Vitamin")).map((v) => `${v.nutrientName}: ${v.value}${v.unitName}`);
        const minerals = nutrients.filter(
          (n) => ["Iron", "Calcium", "Potassium", "Magnesium", "Zinc", "Phosphorus"].some(
            (m) => n.nutrientName.includes(m)
          )
        ).map((m) => `${m.nutrientName}: ${m.value}${m.unitName}`);
        const healthBenefits = [];
        if (calories < 50)
          healthBenefits.push("Low in calories, good for weight management");
        if (vitamins.find((v) => v.includes("Vitamin C")))
          healthBenefits.push("Rich in Vitamin C, supports immune system");
        if (minerals.find((m) => m.includes("Potassium")))
          healthBenefits.push("High in Potassium, supports heart health");
        if (minerals.find((m) => m.includes("Calcium")))
          healthBenefits.push("Contains Calcium, supports bone health");
        if (healthBenefits.length === 0)
          healthBenefits.push("General source of nutrients and minerals");
        return {
          foodName: food.description,
          calories,
          protein,
          fat,
          carbs,
          vitamins: vitamins.length ? vitamins : void 0,
          minerals: minerals.length ? minerals : void 0,
          healthBenefits
        };
      });
      const agentText = `Nutritional info for ${response.text.foodName || "food"} fetched successfully.`;
      const artifacts = [
        {
          artifactId: randomUUID(),
          name: `${agentId}Response`,
          parts: [{ kind: "text", text: agentText }]
        },
        {
          artifactId: randomUUID(),
          name: "ToolResults",
          parts: [
            {
              kind: "data",
              data: response.text
            }
          ]
        }
      ];
      const history = [
        ...messagesList.map((msg) => ({
          kind: "message",
          role: msg.role,
          parts: msg.parts,
          messageId: msg.messageId || randomUUID(),
          taskId: msg.taskId || taskId || randomUUID()
        })),
        {
          kind: "message",
          role: "agent",
          parts: [{ kind: "text", text: agentText }],
          messageId: randomUUID(),
          taskId: taskId || randomUUID()
        }
      ];
      return c.json({
        jsonrpc: "2.0",
        id: requestId,
        result: {
          id: taskId || randomUUID(),
          contextId: contextId || randomUUID(),
          status: {
            state: "completed",
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            message: {
              messageId: randomUUID(),
              role: "agent",
              parts: [{ kind: "text", text: agentText }],
              kind: "message"
            }
          },
          artifacts,
          history,
          kind: "task"
        }
      });
    } catch (error) {
      return c.json(
        {
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32603,
            message: "Internal error",
            data: { details: error.message }
          }
        },
        500
      );
    }
  }
});

const mastra = new Mastra({
  agents: {
    nutritionAgent
  },
  storage: new LibSQLStore({
    url: ":memory:"
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "debug"
  }),
  observability: {
    default: {
      enabled: true
    }
  },
  server: {
    build: {
      openAPIDocs: true,
      swaggerUI: true
    },
    apiRoutes: [foodInfoAgentRoute]
  }
});

export { mastra };
