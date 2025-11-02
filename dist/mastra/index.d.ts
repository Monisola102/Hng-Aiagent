import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
declare const mastra: Mastra<{
    nutritionAgent: import("@mastra/core/agent").Agent<"Nutrition Agent", {
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
}, Record<string, import("@mastra/core/dist/workflows/legacy").LegacyWorkflow<import("@mastra/core/dist/workflows/legacy").LegacyStep<string, any, any, import("@mastra/core/dist/workflows/legacy").StepExecutionContext<any, import("@mastra/core/dist/workflows/legacy").WorkflowContext<any, import("@mastra/core/dist/workflows/legacy").LegacyStep<string, any, any, any>[], Record<string, any>>>>[], string, any, any>>, Record<string, import("@mastra/core/workflows").Workflow<any, any, any, any, any, any, any>>, Record<string, import("@mastra/core/vector").MastraVector<import("@mastra/core/vector/filter").VectorFilter>>, Record<string, import("@mastra/core/dist/tts").MastraTTS>, PinoLogger, Record<string, import("@mastra/core/dist/mcp").MCPServerBase>, Record<string, import("@mastra/core/scores").MastraScorer<any, any, any, any>>>;
export { mastra };
//# sourceMappingURL=index.d.ts.map