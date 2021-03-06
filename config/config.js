/**
 * XMEN project settings for {{ project_name }}.
 *
 *
 */
const path = require("path");
const rootPath = path.normalize(__dirname + "/..");

module.exports = {
  development: {
    // Build paths relative to the root path of the project.
    rootPath: rootPath,

    // Secret key, remove this key from production files, keep this secret.
    secretKey: "xmen",

    // Project settings

    // Include either node_module or relative path. Must be in order.
    installedApps: ["xmen/contrib/auth", "xmen/contrib/admin"],

    middleware: [],

    // Database settings

    databases: {
      default: {
        uri: "mongodb://localhost:27017/xmen"
      }
    },

    // Server settings

    host: "localhost",
    port: 8000,

    // Cors settings
    xsAllowCredentials: true,
    xsAllowOrigin: "*",
    xsAllowMethods: "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE",
    xsAllowHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",

    staticPath: rootPath + "/public"
  }
};
