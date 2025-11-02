import { z } from "zod";
declare const foodInfoTool: import("@mastra/core/tools").Tool<z.ZodObject<{
    food: z.ZodString;
}, "strip", z.ZodTypeAny, {
    food: string;
}, {
    food: string;
}>, z.ZodObject<{
    foodName: z.ZodString;
    calories: z.ZodOptional<z.ZodNumber>;
    protein: z.ZodOptional<z.ZodString>;
    fat: z.ZodOptional<z.ZodString>;
    carbs: z.ZodOptional<z.ZodString>;
    vitamins: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    minerals: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    healthBenefits: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    image: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
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
}>, any, any, import("@mastra/core/tools").ToolExecutionContext<z.ZodObject<{
    food: z.ZodString;
}, "strip", z.ZodTypeAny, {
    food: string;
}, {
    food: string;
}>, any, any>> & {
    inputSchema: z.ZodObject<{
        food: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        food: string;
    }, {
        food: string;
    }>;
    outputSchema: z.ZodObject<{
        foodName: z.ZodString;
        calories: z.ZodOptional<z.ZodNumber>;
        protein: z.ZodOptional<z.ZodString>;
        fat: z.ZodOptional<z.ZodString>;
        carbs: z.ZodOptional<z.ZodString>;
        vitamins: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        minerals: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        healthBenefits: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        image: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
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
    execute: (context: import("@mastra/core/tools").ToolExecutionContext<z.ZodObject<{
        food: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        food: string;
    }, {
        food: string;
    }>, any, any>, options: import("@mastra/core/tools").MastraToolInvocationOptions) => Promise<any>;
};
export { foodInfoTool };
//# sourceMappingURL=food-info-tool.d.ts.map