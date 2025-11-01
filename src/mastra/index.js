const { Mastra } = require("@mastra/core/mastra");
const { PinoLogger } = require("@mastra/loggers");
const { LibSQLStore } = require("@mastra/libsql");
const {nutritionAgent} = require("./agents/nutritionagent.js")
const { a2aAgentRoute } = require("./routes/agentRoutes.js");

const mastra = new Mastra({
  agents: { nutritionAgent },
  storage: new LibSQLStore({ url: ":memory:" }),
  logger: new PinoLogger({
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
    apiRoutes: [a2aAgentRoute],
  },
});

module.exports = { mastra };
