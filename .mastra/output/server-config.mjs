function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

const mastra = new Mastra({
  agents: {
    nutritionAgent
  },
  storage: new LibSQLStore({
    url: ":memory:"
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "debug"
  }),
  observability: {
    default: {
      enabled: true
    }
  },
  server: {
    build: {
      openAPIDocs: true,
      swaggerUI: true
    },
    apiRoutes: [a2aAgentRoute]
  }
});
var mastra_1 = {
  mastra
};
var index = /* @__PURE__ */ getDefaultExportFromCjs(mastra_1);
const server = {
  build: {
    openAPIDocs: true,
    swaggerUI: true
  },
  apiRoutes: [a2aAgentRoute]
};

export { index as default, server };
