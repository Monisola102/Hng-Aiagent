import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const SPOONACULAR_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!SPOONACULAR_API_KEY) {
  throw new Error(
    "GOOGLE_GENERATIVE_AI_API_KEY is missing from your environment variables."
  );
}
const foodInfoTool = createTool({
  id: "get-food-info-dynamic",
  description: "Fetch nutritional information, vitamins, minerals, and dynamic health benefits for any food using Spoonacular API",
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
    healthBenefits: z.array(z.string()).optional(),
    image: z.string().optional()
  }),
  execute: async ({ context }) => {
    const query = encodeURIComponent(context.food);
    const searchRes = await fetch(
      `https://api.spoonacular.com/food/ingredients/search?query=${query}&apiKey=${SPOONACULAR_API_KEY}`
    );
    const searchData = await searchRes.json();
    if (!searchData.results?.[0])
      throw new Error(`No results found for "${context.food}"`);
    const ingredient = searchData.results[0];
    const infoRes = await fetch(
      `https://api.spoonacular.com/food/ingredients/${ingredient.id}/information?amount=100&unit=grams&apiKey=${SPOONACULAR_API_KEY}`
    );
    const infoData = await infoRes.json();
    const nutrients = infoData.nutrition?.nutrients || [];
    const calories = nutrients.find((n) => n.name === "Calories")?.amount || 0;
    const protein = nutrients.find((n) => n.name === "Protein")?.amount + " g";
    const fat = nutrients.find((n) => n.name === "Fat")?.amount + " g";
    const carbs = nutrients.find((n) => n.name === "Carbohydrates")?.amount + " g";
    const vitamins = nutrients.filter((n) => n.name.startsWith("Vitamin")).map((v) => `${v.name}: ${v.amount}${v.unit}`);
    const minerals = nutrients.filter(
      (n) => [
        "Iron",
        "Calcium",
        "Potassium",
        "Magnesium",
        "Zinc",
        "Phosphorus"
      ].some((m) => n.name.includes(m))
    ).map((n) => `${n.name}: ${n.amount}${n.unit}`);
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
      vitamins: vitamins.length ? vitamins : void 0,
      minerals: minerals.length ? minerals : void 0,
      healthBenefits,
      image: `https://spoonacular.com/cdn/ingredients_500x500/${ingredient.image}`
    };
  }
});

export { foodInfoTool };
