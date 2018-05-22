/**
 * Xmen Auth app.
 */
const passport = require("passport");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const cookieParser = require("cookie-parser");

xmen.app.use(
  session({
    secret: xmen.config.secretKey,
    store: new mongoStore({
      url: xmen.config.databases.default.uri,
      collection: "xmen_sessions"
    }),
    resave: true,
    saveUninitialized: true
  })
);

// Use passport session
xmen.app.use(passport.initialize());
xmen.app.use(cookieParser());
xmen.app.use(passport.session());
