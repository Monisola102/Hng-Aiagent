"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodInfoAgentRoute = void 0;
const server_1 = require("@mastra/core/server");
const crypto_1 = require("crypto");
require("dotenv").config();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const foodInfoAgentRoute = (0, server_1.registerApiRoute)("/a2a/agent/food-info/:agentId", {
    method: "POST",
    handler: async (c) => {
        try {
            const mastra = c.get("mastra");
            const agentId = c.req.param("agentId");
            const body = await c.req.json();
            const { jsonrpc, id: requestId, params } = body;
            if (jsonrpc !== "2.0" || !requestId) {
                return c.json({
                    jsonrpc: "2.0",
                    id: requestId || null,
                    error: {
                        code: -32600,
                        message: 'Invalid Request: jsonrpc must be "2.0" and id is required',
                    },
                }, 400);
            }
            const agent = mastra.getAgent(agentId);
            if (!agent) {
                return c.json({
                    jsonrpc: "2.0",
                    id: requestId,
                    error: {
                        code: -32602,
                        message: `Agent '${agentId}' not found`,
                    },
                }, 404);
            }
            const { message, messages, contextId, taskId } = params || {};
            let messagesList = [];
            if (message)
                messagesList = [message];
            else if (messages && Array.isArray(messages))
                messagesList = messages;
            const mastraMessages = messagesList.map((msg) => ({
                role: msg.role,
                content: msg.parts
                    ?.map((part) => part.kind === "text"
                    ? part.text
                    : part.kind === "data"
                        ? JSON.stringify(part.data)
                        : "")
                    .join("\n") || "",
            }));
            const response = await agent.generate(mastraMessages, async () => {
                const query = messagesList[0]?.parts?.[0]?.text || "apple";
                const encodedQuery = encodeURIComponent(query);
                const searchRes = await fetch(`https://api.spoonacular.com/food/ingredients/search?query=${encodedQuery}&apiKey=${SPOONACULAR_API_KEY}`);
                const searchData = await searchRes.json();
                if (!searchData.results?.[0])
                    throw new Error(`No results found for "${query}"`);
                const ingredient = searchData.results[0];
                const infoRes = await fetch(`https://api.spoonacular.com/food/ingredients/${ingredient.id}/information?amount=100&unit=grams&apiKey=${SPOONACULAR_API_KEY}`);
                const infoData = await infoRes.json();
                const nutrients = infoData.nutrition?.nutrients || [];
                const calories = nutrients.find((n) => n.name === "Calories")?.amount || 0;
                const protein = nutrients.find((n) => n.name === "Protein")?.amount + " g";
                const fat = nutrients.find((n) => n.name === "Fat")?.amount + " g";
                const carbs = nutrients.find((n) => n.name === "Carbohydrates")?.amount + " g";
                const vitamins = nutrients
                    .filter((n) => n.name.startsWith("Vitamin"))
                    .map((v) => `${v.name}: ${v.amount}${v.unit}`);
                const minerals = nutrients
                    .filter((n) => [
                    "Iron",
                    "Calcium",
                    "Potassium",
                    "Magnesium",
                    "Zinc",
                    "Phosphorus",
                ].some((m) => n.name.includes(m)))
                    .map((n) => `${n.name}: ${n.amount}${n.unit}`);
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
                    foodName: infoData.name || ingredient.name,
                    calories,
                    protein,
                    fat,
                    carbs,
                    vitamins: vitamins.length ? vitamins : undefined,
                    minerals: minerals.length ? minerals : undefined,
                    healthBenefits,
                    image: `https://spoonacular.com/cdn/ingredients_500x500/${ingredient.image}`,
                };
            });
            const agentText = `Nutritional info for ${response.text.foodName || "food"} fetched successfully.`;
            const artifacts = [
                {
                    artifactId: (0, crypto_1.randomUUID)(),
                    name: `${agentId}Response`,
                    parts: [{ kind: "text", text: agentText }],
                },
                {
                    artifactId: (0, crypto_1.randomUUID)(),
                    name: "ToolResults",
                    parts: [
                        {
                            kind: "data",
                            data: response.text,
                        },
                    ],
                },
            ];
            const history = [
                ...messagesList.map((msg) => ({
                    kind: "message",
                    role: msg.role,
                    parts: msg.parts,
                    messageId: msg.messageId || (0, crypto_1.randomUUID)(),
                    taskId: msg.taskId || taskId || (0, crypto_1.randomUUID)(),
                })),
                {
                    kind: "message",
                    role: "agent",
                    parts: [{ kind: "text", text: agentText }],
                    messageId: (0, crypto_1.randomUUID)(),
                    taskId: taskId || (0, crypto_1.randomUUID)(),
                },
            ];
            return c.json({
                jsonrpc: "2.0",
                id: requestId,
                result: {
                    id: taskId || (0, crypto_1.randomUUID)(),
                    contextId: contextId || (0, crypto_1.randomUUID)(),
                    status: {
                        state: "completed",
                        timestamp: new Date().toISOString(),
                        message: {
                            messageId: (0, crypto_1.randomUUID)(),
                            role: "agent",
                            parts: [{ kind: "text", text: agentText }],
                            kind: "message",
                        },
                    },
                    artifacts,
                    history,
                    kind: "task",
                },
            });
        }
        catch (error) {
            return c.json({
                jsonrpc: "2.0",
                id: null,
                error: {
                    code: -32603,
                    message: "Internal error",
                    data: { details: error.message },
                },
            }, 500);
        }
    },
});
exports.foodInfoAgentRoute = foodInfoAgentRoute;
//# sourceMappingURL=agentRoutes.js.map