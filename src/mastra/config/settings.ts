import dotenv from "dotenv";

dotenv.config();


const spoonacularKey = process.env.SPOONACULAR_API_KEY;

export const settings ={ spoonacularKey };