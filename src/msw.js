if (import.meta.env.USE_MOCKS === "true") {
  // eslint-disable-next-line global-require
  const { worker } = require("./mocks/browser");
  worker.start();
}
