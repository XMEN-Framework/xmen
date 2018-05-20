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
const passport = require("passport");
const mongoose = require("mongoose");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const methodOverride = require("method-override");
const helmet = require("helmet");
const cors = require("cors");

const logger = require("./debug/logger");
let { AppRegistry } = require("./core/app-registry");

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

    this.config = {
      startTime: Date.now(),
      root: process.cwd(),
      host: process.env.HOST || "localhost",
      port: process.env.PORT || 8080,
      environment: process.env.NODE_ENV || "development",
      database: null,
      appRoot: process.cwd() + "/app",
      staticRoot: process.cwd() + "/public",
      cacheView: false,
      installedApps: []
    };
  }

  start(config = {}, callback) {
    try {
      this.log.debug(
        `Server Setup: Loading config for ${this.config.environment}`
      );
      this.config = Object.assign(this.config, config[this.config.environment]);

      this.bootstrap();
    } catch (e) {
      this.log.debug(`XMEN server could not start correctly.`);
      this.log.error(e);
      this.log.error(e.stack);
    }
  }

  bootstrap() {
    // Connect to database.
    this.database();

    // Set up middleware
    this.middleware();

    // Load core app
    this.loadCore();

    // Load auth app
    this.loadAuth();

    // Load installed apps.
    this.loadApps();

    // Create server.
    this.listen();
  }

  database() {
    if (!this.config.database) return;

    this.log.debug("Server Setup: Connecting to database.");
    mongoose.Promise = global.Promise;
    var promise = mongoose.connect(this.config.database, {
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

  middleware() {
    this.log.debug("Server Setup: Loading middleware");
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
    this.app.use(express.static(this.config.staticRoot));

    this.app.use(morgan("dev"));

    // Set the templating engine.
    this.app.set("view engine", "pug");

    // Set view cache
    this.app.set("view cache", this.config.cacheView);

    // Enable jsonp
    this.app.enable("jsonp callback");

    // Connect body parser
    this.app.use(bodyParser.json({}));
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Use method override
    this.app.use(methodOverride());

    // Use passport session
    this.app.use(passport.initialize());
    this.app.use(cookieParser());
    this.app.use(passport.session());

    this.app.use(cors());

    // Set cors.
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Credentials", true);
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      next();
    });
  }

  loadCore() {
    // Load core models.
    require("./core/models/content_type");
  }

  loadAuth() {
    // Load auth models.
    require("./auth/models/permission");
    require("./auth/models/group");
    require("./auth/models/user");
    require("./auth/models/token");

    const ContentType = mongoose.model("ContentType");
    const Permission = mongoose.model("Permission");
    const Group = mongoose.model("Group");
    const User = mongoose.model("User");
    const Token = mongoose.model("Token");

    // Add content types to database.
    ContentType.addModel(
      "xmen_auth",
      Permission.collection.name,
      (err, model) => {
        // Create permissions
        Permission.createModelPermissions(model);
      }
    );
    ContentType.addModel("xmen_auth", Group.collection.name, (err, model) => {
      // Create permissions
      Permission.createModelPermissions(model);
    });
    ContentType.addModel("xmen_auth", User.collection.name, (err, model) => {
      // Create permissions
      Permission.createModelPermissions(model);
    });
  }

  loadApps() {
    this.log.debug("Server Setup: Registering apps");
    AppRegistry.registerApps(this.config.installedApps);
  }
}

module.exports = new Xmen();
