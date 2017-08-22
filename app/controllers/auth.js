/**
 * Auth Controller
 */

var mongoose = require("mongoose");
var User = mongoose.model("User");
var Token = mongoose.model("Token");
var hat = require("hat");

exports.loginPage = (req, res) => {
  res.render("auth/login");
};

exports.registerPage = (req, res) => {
  res.render("auth/register");
};

exports.forgotPasswordPage = (req, res) => {
  res.render("auth/forgot-password");
};

exports.resetPasswordPage = (req, res) => {
  res.render("auth/reset-password");
};

exports.me = (req, res) => {
  res.status(200).send(req.user);
};

exports.updateMe = (req, res) => {
  req.user = Object.assign(req.user, req.body);

  req.user.save((err, user) => {
    if (err) return res.status(400).send(err);
    return res.send(user);
  });
};

exports.changePassword = (req, res) => {
  User.findOne({
    _id: req.user._id
  })
    .select("hashed_password salt")
    .exec((err, user) => {
      if (err) return res.status(400).send(err);

      //Check hashed password against salted body password.
      if (user.authenticate(req.body.password)) {
        user.password = req.body.new_password;
        user.save((err, user) => {
          if (err) return res.status(400).send(err);

          return res.send(user);
        });
      } else {
        return res.status(400).send("Invalid password");
      }
    });
};

exports.login = (req, res) => {
  var token = new Token({
    user: req.user._id,
    value: hat()
  });

  token.save(function(err, token) {
    res.status(200).send({
      user: req.user,
      auth_token: token.value
    });
  });
};

exports.register = (req, res) => {
  var newUser = new User(req.body);

  newUser.save(err => {
    if (err) return res.status(400).send(err);

    req.logIn(newUser, err => {
      if (err) return res.status(400).send(err);
      return res.send(newUser);
    });
  });
};
