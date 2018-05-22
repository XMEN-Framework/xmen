process.on("uncaughtException", err => {
  console.log(err);
});

const express = require("express");

const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = mongoose.connect(config.database, {
  useMongoClient: true
});

// Boostrap models.
require("../auth/models/user");

const User = mongoose.model("User");

const admin = new User({
  first_name: "Admin",
  last_name: "",
  email: "admin@xmen.io",
  is_superuser: true,
  is_staff: true,
  password: "xmen"
});

admin.save(err => {
  if (err) {
    console.log("[ERROR] There was an error creating admin.");
    console.log(err);
  } else {
    console.log("[SUCCESS] Admin has been created.");
  }
  process.exit();
});
