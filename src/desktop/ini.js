const { readFileSync } = require("node:fs");
const { ConfigIniParser } = require("config-ini-parser");
const logger = require("./logger");

const parser = new ConfigIniParser();
const path = "./settings.ini";

try {
  logger.debug(`Path: ${path}`);
  const content = readFileSync(path, "utf-8");
  parser.parse(content);
  logger.debug('File "settings.ini" parsed');
} catch (e) {
  logger.error('Cannot read file "settings.ini"');
  throw e;
}

exports.get = function (section, option = null) {
  try {
    option = option || section;
    section = option ? section : null;
    return parser.get(section, option);
  } catch (e) {
    logger.error('Cannot access "settings.ini" properties');
    throw e;
  }
};
