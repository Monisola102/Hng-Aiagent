import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { foodInfoTool } from '../tools/food-info-tool';
import { join } from 'path';
//path
const nutritionAgent = new Agent({
  name: 'Nutrition Agent',
  instructions: `
    You are a helpful nutrition and health assistant.
    - Provide nutritional information and health benefits of foods.
    - Mention key vitamins, minerals, and benefits for different body systems.
    - Be concise but factual.
    - If a food name is not recognized, ask for clarification.
    - Use the foodInfoTool to fetch nutrition data.
  `,
  model: 'google/gemini-2.0-flash',
  tools: { foodInfoTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: `file:${join(__dirname, '../../db/mastra.db')}`,
    }),
  }),
});

export { nutritionAgent };