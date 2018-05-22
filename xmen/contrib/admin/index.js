/**
 * Xmen Admin app.
 */
const flash = require("connect-flash");

xmen.app.use(flash());

require("./routes");
