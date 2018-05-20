/**
 * Public routes
 */
"use strict";

const express = require("express");
const router = express.Router();
const publicController = require("./controllers/public");

router.get("/", publicController.homePage);

xmen.app.use("/", router);
