/**
 * Application
 */

const xmen = require("./xmen");
const config = require("./config/config");

xmen.start(config.development);
