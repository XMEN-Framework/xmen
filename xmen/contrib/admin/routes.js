/**
 * Admin routes
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");
const auth = require("../auth/middleware/authorization");

const adminController = require("./controllers/admin");
const authController = require("./controllers/auth");

router.get("/", auth.authenticateAdmin, adminController.home);

router.get("/login", authController.loginPage);
router.get("/logout", auth.authenticateAdmin, authController.logout);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/manage/login",
    failureFlash: "Invalid email or password."
  }),
  authController.login
);

xmen.app.use("/manage", (req, res, next) => {
  res.locals.user = req.user;
  next();
});
xmen.app.use("/manage", router);
