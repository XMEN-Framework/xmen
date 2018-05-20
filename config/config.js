// config.js

var path = require("path"),
  rootPath = path.normalize(__dirname + "/..");

module.exports = {
  development: {
    database: null,
    port: 8000,
    installedApps: [
      // 'auth',
      "public"
    ]
  }
};
