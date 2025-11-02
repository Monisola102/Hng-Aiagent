import { Agent } from '@mastra/core/agent';
declare const nutritionAgent: Agent<"Nutrition Agent", {
    foodInfoTool: import("@mastra/core/tools").Tool<import("zod").ZodObject<{
        food: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        food: string;
    }, {
        food: string;
    }>, import("zod").ZodObject<{
        foodName: import("zod").ZodString;
        calories: import("zod").ZodOptional<import("zod").ZodNumber>;
        protein: import("zod").ZodOptional<import("zod").ZodString>;
        fat: import("zod").ZodOptional<import("zod").ZodString>;
        carbs: import("zod").ZodOptional<import("zod").ZodString>;
        vitamins: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        minerals: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        healthBenefits: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        image: import("zod").ZodOptional<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
        foodName: string;
        calories?: number | undefined;
        protein?: string | undefined;
        fat?: string | undefined;
        carbs?: string | undefined;
        vitamins?: string[] | undefined;
        minerals?: string[] | undefined;
        healthBenefits?: string[] | undefined;
        image?: string | undefined;
    }, {
        foodName: string;
        calories?: number | undefined;
        protein?: string | undefined;
        fat?: string | undefined;
        carbs?: string | undefined;
        vitamins?: string[] | undefined;
        minerals?: string[] | undefined;
        healthBenefits?: string[] | undefined;
        image?: string | undefined;
    }>, any, any, import("@mastra/core").ToolExecutionContext<import("zod").ZodObject<{
        food: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        food: string;
    }, {
        food: string;
    }>, any, any>> & {
        inputSchema: import("zod").ZodObject<{
            food: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            food: string;
        }, {
            food: string;
        }>;
        outputSchema: import("zod").ZodObject<{
            foodName: import("zod").ZodString;
            calories: import("zod").ZodOptional<import("zod").ZodNumber>;
            protein: import("zod").ZodOptional<import("zod").ZodString>;
            fat: import("zod").ZodOptional<import("zod").ZodString>;
            carbs: import("zod").ZodOptional<import("zod").ZodString>;
            vitamins: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            minerals: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            healthBenefits: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            image: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            foodName: string;
            calories?: number | undefined;
            protein?: string | undefined;
            fat?: string | undefined;
            carbs?: string | undefined;
            vitamins?: string[] | undefined;
            minerals?: string[] | undefined;
            healthBenefits?: string[] | undefined;
            image?: string | undefined;
        }, {
            foodName: string;
            calories?: number | undefined;
            protein?: string | undefined;
            fat?: string | undefined;
            carbs?: string | undefined;
            vitamins?: string[] | undefined;
            minerals?: string[] | undefined;
            healthBenefits?: string[] | undefined;
            image?: string | undefined;
        }>;
        execute: (context: import("@mastra/core").ToolExecutionContext<import("zod").ZodObject<{
            food: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            food: string;
        }, {
            food: string;
        }>, any, any>, options: import("@mastra/core").MastraToolInvocationOptions) => Promise<any>;
    };
}, Record<string, import("@mastra/core").Metric>>;
export { nutritionAgent };
//# sourceMappingURL=nutritionagent.d.ts.map