/**
 * Generic require login routing middleware
 */
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const CookieStrategy = require("passport-cookie").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const User = mongoose.model("User");

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.findOne({ _id: id }).exec((err, user) => {
    next(err, user);
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    (username, password, next) => {
      const query =
        username.indexOf("@") === -1
          ? { username: username }
          : { email: username };

      User.findOne(query)
        .select("hashed_password is_superuser provider salt email")
        .exec((err, user) => {
          if (err) return next(err);

          if (!user) {
            return next(null, false, {
              message: "Email or password is incorrect."
            });
          }

          if (!user.authenticate(password)) {
            return next(null, false, {
              message: "Email or password is incorrect."
            });
          }

          return next(null, user);
        });
    }
  )
);

/**
 * Check if the request has an authenticated user.
 */
exports.requiresLogin = function(req, res, next) {
  //Not authenticated, send to login.
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: "Authentication credentials were not provided."
    });
  }
  next();
};

/**
 * Check if the request has an authenticated admin user.
 */
exports.requiresAdmin = function(req, res, next) {
  //Not authenticated, send to login.
  if (req.user) {
    if (!req.user.is_superuser) {
      return res.status(401).send({
        message: "Authentication credentials were not provided."
      });
    }
  } else {
    return res.status(401).send({
      message: "Authentication credentials were not provided."
    });
  }
  next();
};

exports.authenticateAdmin = (req, res, next) => {
  //Not authenticated, send to manage login.
  if (req.user) {
    console.log("User logged in");
    if (!req.user.is_superuser) {
      console.log("User not a super user, redirect");
      return res.redirect("/manage/login");
      res.locals.user = req.user;
    }
  } else {
    return res.redirect("/manage/login");
  }
  next();
};

/**
 * Check if the request has an authenticated header token.
 */
exports.requiresToken = function(req, res, next) {
  var authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({
      message: "Authentication credentials were not provided."
    });
  }

  var authToken = authHeader.split(" ")[1];

  if (!authToken) {
    return res.status(401).send({
      message: "Authentication credentials were not provided."
    });
  }

  Token.findOne({ value: authToken })
    .populate("user")
    .exec(function(err, token) {
      if (err) {
        return res.send(401, {
          message: "Invalid token."
        });
      }

      if (!token) {
        return res.send(401, {
          message: "Invalid token."
        });
      }

      req.token = token;
      req.user = token.user;

      next();
    });
};
