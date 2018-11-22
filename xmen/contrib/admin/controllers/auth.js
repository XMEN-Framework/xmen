/**
 * Admin auth controllers.
 */

exports.loginPage = (req, res) => {
  console.log("Loading login view");
  return res.render("contrib/admin/views/login", {
    flash: req.flash()
  });
};

exports.login = (req, res) => {
  req.user.last_login = new Date();
  req.user.save();

  return res.redirect("/admin");
};

exports.logout = (req, res) => {
  req.logout();
  return res.redirect("/admin/login");
};
