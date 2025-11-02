import { registerApiRoute } from "@mastra/core/server";
import { randomUUID } from "crypto";
import { settings } from "../config/settings";


const SPOONACULAR_API_KEY = settings.spoonacularKey;

interface Nutrient {
    name: string;
    amount: number;
    unit: string;
}

interface Ingredient {
    id: number;
    name: string;
    image: string;
}

interface SearchData {
    results: Ingredient[];
}

interface NutritionData {
    nutrition: {
        nutrients: Nutrient[];
    };
    name: string;
}

interface Message {
    role: string;
    parts: Array<{
        kind: string;
        text?: string;
        data?: any;
    }>;
    messageId?: string;
    taskId?: string;
}

interface RequestBody {
    jsonrpc: string;
    id: string | null;
    params?: {
        message?: Message;
        messages?: Message[];
        contextId?: string;
        taskId?: string;
    };
}

interface FoodInfoResponse {
    foodName: string;
    calories: number;
    protein: string;
    fat: string;
    carbs: string;
    vitamins: string[] | undefined;
    minerals: string[] | undefined;
    healthBenefits: string[];
    image: string;
}

const foodInfoAgentRoute = registerApiRoute("/a2a/agent/food-info/:agentId", {
    method: "POST",
    handler: async (c: any) => {
        try {
            const mastra = c.get("mastra");
            const agentId = c.req.param("agentId");

            const body = await c.req.json() as RequestBody;
            const { jsonrpc, id: requestId, params } = body;
            if (jsonrpc !== "2.0" || !requestId) {
                return c.json(
                    {
                        jsonrpc: "2.0",
                        id: requestId || null,
                        error: {
                            code: -32600,
                            message:
                                'Invalid Request: jsonrpc must be "2.0" and id is required',
                        },
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
                            message: `Agent '${agentId}' not found`,
                        },
                    },
                    404
                );
            }

            const { message, messages, contextId, taskId } = params || {};
            let messagesList: Message[] = [];
            if (message) messagesList = [message];
            else if (messages && Array.isArray(messages)) messagesList = messages;
            const mastraMessages = messagesList.map((msg) => ({
                role: msg.role,
                content:
                    msg.parts
                        ?.map((part) =>
                            part.kind === "text"
                                ? part.text
                                : part.kind === "data"
                                    ? JSON.stringify(part.data)
                                    : ""
                        )
                        .join("\n") || "",
            }));
            const response = await agent.generate(mastraMessages, async () => {
                const query = messagesList[0]?.parts?.[0]?.text || "apple";
                const encodedQuery = encodeURIComponent(query);
                const searchRes = await fetch(
                    `https://api.spoonacular.com/food/ingredients/search?query=${encodedQuery}&apiKey=${SPOONACULAR_API_KEY}`
                );
                const searchData = await searchRes.json() as SearchData;
                if (!searchData.results?.[0])
                    throw new Error(`No results found for "${query}"`);
                const ingredient = searchData.results[0];
                const infoRes = await fetch(
                    `https://api.spoonacular.com/food/ingredients/${ingredient.id}/information?amount=100&unit=grams&apiKey=${SPOONACULAR_API_KEY}`
                );
                const infoData = await infoRes.json() as NutritionData;
                const nutrients = infoData.nutrition?.nutrients || [];

                const calories =
                    nutrients.find((n) => n.name === "Calories")?.amount || 0;
                const protein =
                    nutrients.find((n) => n.name === "Protein")?.amount + " g";
                const fat = nutrients.find((n) => n.name === "Fat")?.amount + " g";
                const carbs =
                    nutrients.find((n) => n.name === "Carbohydrates")?.amount + " g";

                const vitamins = nutrients
                    .filter((n) => n.name.startsWith("Vitamin"))
                    .map((v) => `${v.name}: ${v.amount}${v.unit}`);
                const minerals = nutrients
                    .filter((n) =>
                        [
                            "Iron",
                            "Calcium",
                            "Potassium",
                            "Magnesium",
                            "Zinc",
                            "Phosphorus",
                        ].some((m) => n.name.includes(m))
                    )
                    .map((n) => `${n.name}: ${n.amount}${n.unit}`);

                const healthBenefits: string[] = [];
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
                } as FoodInfoResponse;
            });

            const agentText = `Nutritional info for ${(response.text as FoodInfoResponse).foodName || "food"
                } fetched successfully.`;
            const artifacts = [
                {
                    artifactId: randomUUID(),
                    name: `${agentId}Response`,
                    parts: [{ kind: "text", text: agentText }],
                },
                {
                    artifactId: randomUUID(),
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
                    messageId: msg.messageId || randomUUID(),
                    taskId: msg.taskId || taskId || randomUUID(),
                })),
                {
                    kind: "message",
                    role: "agent",
                    parts: [{ kind: "text", text: agentText }],
                    messageId: randomUUID(),
                    taskId: taskId || randomUUID(),
                },
            ];

            return c.json({
                jsonrpc: "2.0",
                id: requestId,
                result: {
                    id: taskId || randomUUID(),
                    contextId: contextId || randomUUID(),
                    status: {
                        state: "completed",
                        timestamp: new Date().toISOString(),
                        message: {
                            messageId: randomUUID(),
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
        } catch (error: any) {
            return c.json(
                {
                    jsonrpc: "2.0",
                    id: null,
                    error: {
                        code: -32603,
                        message: "Internal error",
                        data: { details: error.message },
                    },
                },
                500
            );
        }
    },
});

export { foodInfoAgentRoute };