const { createLogger, transports, format } = require("winston");
const { Console } = transports;
const { timestamp, prettyPrint, colorize, combine, printf } = format;

const customFormat = combine(
  timestamp({
    format: "DD/MM/YYYY hh:mm:ss A",
  }),
  prettyPrint(),
  printf(
    ({ timestamp, message, level }) => `[${timestamp}][${level}] - ${message}`
  )
);

module.exports = createLogger({
  transports: [
    new Console({
      format: combine(colorize(), customFormat),
      level: "debug",
    }),
  ],
});
