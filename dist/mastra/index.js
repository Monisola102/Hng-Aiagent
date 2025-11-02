"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mastra = void 0;
const mastra_1 = require("@mastra/core/mastra");
const loggers_1 = require("@mastra/loggers");
const libsql_1 = require("@mastra/libsql");
const nutritionagent_1 = require("./agents/nutritionagent");
const agentRoutes_1 = require("./routes/agentRoutes");
const mastra = new mastra_1.Mastra({
    agents: { nutritionAgent: nutritionagent_1.nutritionAgent },
    storage: new libsql_1.LibSQLStore({ url: ":memory:" }),
    logger: new loggers_1.PinoLogger({
        name: "Mastra",
        level: "debug",
    }),
    observability: {
        default: { enabled: true },
    },
    server: {
        build: {
            openAPIDocs: true,
            swaggerUI: true,
        },
        apiRoutes: [agentRoutes_1.foodInfoAgentRoute],
    },
});
exports.mastra = mastra;
//# sourceMappingURL=index.js.map