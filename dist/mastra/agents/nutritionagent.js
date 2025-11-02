"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nutritionAgent = void 0;
const agent_1 = require("@mastra/core/agent");
const memory_1 = require("@mastra/memory");
const libsql_1 = require("@mastra/libsql");
const food_info_tool_1 = require("../tools/food-info-tool");
const nutritionAgent = new agent_1.Agent({
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
    tools: { foodInfoTool: food_info_tool_1.foodInfoTool },
    memory: new memory_1.Memory({
        storage: new libsql_1.LibSQLStore({
            url: 'file:./db/mastra.db',
        }),
    }),
});
exports.nutritionAgent = nutritionAgent;
//# sourceMappingURL=nutritionagent.js.map