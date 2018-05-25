/**
 * XMEN Server application
 *
 * Bootstrap application, create database connection, mount express routes,
 * require mongoose models.
 */

"use strict";

const express = require("express");
const http = require("http");
const errorhandler = require("errorhandler");
const mongoose = require("mongoose");
const compression = require("compression");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const methodOverride = require("method-override");
const helmet = require("helmet");
const cors = require("cors");

const logger = require("./debug/logger");
const { AppRegistry } = require("./apps/app-registry");

/**
 * Xmen server.
 */
class Xmen {
  constructor() {
    // Express app
    this.app = express();

    // Server.
    this.server = null;

    // Logger
    this.log = logger;

    this.viewPaths = [__dirname];

    // Default configuration options.
    this.config = {
      rootPath: null,
      startTime: Date.now(),
      databases: null,
      staticRoot: process.cwd() + "/public",
      installedApps: [],
      xsAllowCredentials: true,
      xsAllowOrigin: "*",
      xsAllowMethods: "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE",
      xsAllowHeaders:
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    };
  }

  start(config = {}, callback) {
    try {
      this.log.debug(
        `Server Setup: Loading config for ${this.config.environment}`
      );
      this.config = Object.assign(this.config, config);

      this.bootstrap();
    } catch (e) {
      this.log.debug(`XMEN server could not start correctly.`);
      this.log.error(e);
      this.log.error(e.stack);
    }
  }

  bootstrap() {
    // Connect to database.
    this.setupDatabase();

    // Set up middleware
    this.setupExpressMiddleware();

    // Load installed apps.
    this.loadApps();

    // Create server.
    this.listen();
  }

  setupDatabase() {
    if (!this.config.databases) return;

    this.log.debug("Server Setup: Connecting to database.");
    mongoose.Promise = global.Promise;
    var promise = mongoose.connect(this.config.databases.default.uri, {
      useMongoClient: true
    });

    return promise.then(
      db => {
        db.on("error", err => this.log.error(err.message));
        db.on("open", () => this.log.debug("MongoDB connection open"));
        db.on("close", () => this.log.debug("MongoDB connection closed"));
      },
      err => {
        this.log.error("Could not connect to MongoDB");
      }
    );
  }

  listen() {
    this.log.debug("Server Setup: Creating server listener");
    this.app.use(
      errorhandler({
        showStack: true,
        dumpExceptions: true
      })
    );

    this.server = this.app.listen(this.config.port);

    this.log.debug("XMEN server starting on port " + this.config.port);
  }

  setupExpressMiddleware() {
    this.log.debug("Server Setup: Configuring Express");
    this.app.set("showStackError", true);

    this.app.use(helmet());

    // Compress static files.
    this.app.use(
      compression({
        filter: function(req, res) {
          return /json|text|javascript|css/.test(res.getHeader("Content-Type"));
        },
        level: 9
      })
    );

    // Set the static root to serve files.
    this.app.use(express.static(this.config.staticPath));

    this.app.use(morgan("dev"));

    // Set the templating engine.
    this.app.set("view engine", "pug");

    // Set view cache
    this.app.set("view cache", true);

    this.viewPaths.push(this.config.rootPath + "/apps");
    this.app.set("views", this.viewPaths);

    // Enable jsonp
    this.app.enable("jsonp callback");

    // Connect body parser
    this.app.use(bodyParser.json({}));
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Use method override
    this.app.use(methodOverride());

    this.app.use(cors());

    // Set cors.
    this.app.use((req, res, next) => {
      res.header(
        "Access-Control-Allow-Credentials",
        this.config.xsAllowCredentials
      );
      res.header("Access-Control-Allow-Origin", this.config.xsAllowOrigin);
      res.header("Access-Control-Allow-Methods", this.config.xsAllowMethods);
      res.header("Access-Control-Allow-Headers", this.config.xsAllowHeaders);
      next();
    });
  }

  loadApps() {
    this.log.debug("Server Setup: Registering apps");
    AppRegistry.registerApps(this.config.installedApps);
  }
}

module.exports = new Xmen();
