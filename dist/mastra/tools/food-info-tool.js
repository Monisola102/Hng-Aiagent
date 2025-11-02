"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodInfoTool = void 0;
const tools_1 = require("@mastra/core/tools");
const zod_1 = require("zod");
require("dotenv").config();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
if (!SPOONACULAR_API_KEY) {
    throw new Error("SPOONACULAR_API_KEY is missing from your environment variables.");
}
const foodInfoTool = (0, tools_1.createTool)({
    id: "get-food-info-dynamic",
    description: "Fetch nutritional information, vitamins, minerals, and dynamic health benefits for any food using Spoonacular API",
    inputSchema: zod_1.z.object({
        food: zod_1.z.string().describe("Name of the food to look up"),
    }),
    outputSchema: zod_1.z.object({
        foodName: zod_1.z.string(),
        calories: zod_1.z.number().optional(),
        protein: zod_1.z.string().optional(),
        fat: zod_1.z.string().optional(),
        carbs: zod_1.z.string().optional(),
        vitamins: zod_1.z.array(zod_1.z.string()).optional(),
        minerals: zod_1.z.array(zod_1.z.string()).optional(),
        healthBenefits: zod_1.z.array(zod_1.z.string()).optional(),
        image: zod_1.z.string().optional(),
    }),
    execute: async ({ context }) => {
        const query = encodeURIComponent(context.food);
        const searchRes = await fetch(`https://api.spoonacular.com/food/ingredients/search?query=${query}&apiKey=${SPOONACULAR_API_KEY}`);
        const searchData = await searchRes.json();
        if (!searchData.results?.[0])
            throw new Error(`No results found for "${context.food}"`);
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
    },
});
exports.foodInfoTool = foodInfoTool;
//# sourceMappingURL=food-info-tool.js.map