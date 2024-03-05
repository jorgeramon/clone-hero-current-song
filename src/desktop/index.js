const logger = require("./logger");
const { pressAnyKeyAndExit } = require("./stdin");

process.on("uncaughtException", async (err) => {
  logger.error(err.stack);
  await pressAnyKeyAndExit();
});

require("./socket");
