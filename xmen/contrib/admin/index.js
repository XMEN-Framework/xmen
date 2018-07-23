/**
 * Xmen Admin app.
 */
"use strict";

const flash = require("connect-flash");

xmen.app.use(flash());

let routes = require("./routes");
let adminSite = require("./site");
let appRegistry = require("../../apps/app-registry");

module.exports = {
  site: adminSite
};
