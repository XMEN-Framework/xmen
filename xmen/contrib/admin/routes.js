/**
 * Admin routes
 */
"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");
const adminAuth = require("./middleware/authorization");

const adminController = require("./controllers/admin");
const authController = require("./controllers/auth");

router.get("/login", authController.loginPage);

router.get("/", adminAuth.authenticateAdmin, adminController.home);
router.get(
  "/:model",
  adminAuth.authenticateAdmin,
  adminController.modelListPage
);
router.get(
  "/:model/create",
  adminAuth.authenticateAdmin,
  adminController.modelCreatePage
);
router.get(
  "/:model/:id",
  adminAuth.authenticateAdmin,
  adminController.modelEditPage
);

router.post(
  "/:model/create",
  adminAuth.authenticateAdmin,
  adminController.modelCreate
);
router.post(
  "/:model/:id",
  adminAuth.authenticateAdmin,
  adminController.modelEdit
);

router.get("/logout", adminAuth.authenticateAdmin, authController.logout);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/admin/login",
    failureFlash: "Invalid email or password."
  }),
  authController.login
);

xmen.app.use("/admin", (req, res, next) => {
  console.log("Preparing user middleware");
  res.locals.user = req.user;
  next();
});
xmen.app.use("/admin", router);
