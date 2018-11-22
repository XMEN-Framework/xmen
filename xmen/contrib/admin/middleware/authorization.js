/**
 * Admin Authorization
 */
const auth = require("../../auth/middleware/authorization");

/**
 * Check if the API request has an authenticated admin user.
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

/**
 * Check if admin is authenticated.
 */
exports.authenticateAdmin = (req, res, next) => {
  //Not authenticated, send to admin login.
  console.log("Checking admin for: ", req.path);
  if (req.user) {
    if (!req.user.is_superuser) {
      return res.redirect("/admin/login");
      res.locals.user = req.user;
    }
  } else {
    console.log("Redirect to admin login");
    return res.redirect("/admin/login");
  }
  next();
};
