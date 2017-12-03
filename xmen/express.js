/**
 * Express configuration
 */
var express = require("express"),
  path = require("path"),
  compression = require("compression"),
  cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  methodOverride = require("method-override"),
  helmet = require("helmet"),
  cors = require("cors");

module.exports = function(app, config, passport) {
  //Save the configs for later usage.
  app.set("config", config);

  //Show stack error
  app.set("showStackError", true);

  //Include helmet
  app.use(helmet());

  //Compress static files.
  app.use(
    compression({
      filter: function(req, res) {
        return /json|text|javascript|css/.test(res.getHeader("Content-Type"));
      },
      level: 9
    })
  );

  //Set the static root to serve static files
  app.use(express.static(config.STATIC_ROOT));

  app.use(morgan("dev"));

  //Set the templating engine.
  app.set("view engine", "pug");

  //Disable view cache.
  app.set("view cache", false);

  //Enable jsonp
  app.enable("jsonp callback");

  //Save the app env
  app.locals.appENV = process.env.NODE_ENV;

  //Connect body parser
  app.use(bodyParser.json({ limit: 10000000 })); //100 MB
  app.use(bodyParser.urlencoded({ extended: true }));

  //Use method override
  app.use(methodOverride());

  //Use passport session
  app.use(passport.initialize());
  app.use(cookieParser());
  app.use(passport.session());

  app.use(cors());

  app.use(function(req, res, next) {
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

  // 404
  app.use(function(err, req, res, next) {
    //Log it
    console.log(err.stack);

    //Error page.
    res.status(404).render("404", { error: "Page not found." });
  });

  // 500
  app.use(function(err, req, res, next) {
    //Treat as 404
    if (err.message.indexOf("not found")) return next();

    //Log it
    console.log(err.stack);

    //Error page.
    res.status(500).render("500", { error: err.stack });
  });
};
