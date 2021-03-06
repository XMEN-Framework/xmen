/**
 * Command line tool to create a new admin user.
 */
process.on("uncaughtException", err => {
  console.log(err);
});

const readline = require("readline");
const express = require("express");

const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = mongoose.connect(
  config.databases.default.uri,
  {
    useMongoClient: true
  }
);

// Boostrap models.
require("../contrib/auth/models/user");

const User = mongoose.model("User");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function emailQuestion() {
  return new Promise((resolve, reject) => {
    rl.question("Email: ", resolve);
  });
}

function passwordQuestion() {
  return new Promise((resolve, reject) => {
    rl.stdoutMuted = false;
    rl.question("Password: ", resolve);
    rl._writeToOutput = stringToWrite => rl.output.write("*");
  });
}

async function main() {
  console.log("Please enter an email and password for a new admin account.");
  const email = await emailQuestion();
  const password = await passwordQuestion();
  rl.close();

  createAdmin(email, password);
}

function createAdmin(email, password) {
  console.log("\nCreating admin", email);

  const admin = new User({
    first_name: "Admin",
    last_name: "",
    email: email,
    is_superuser: true,
    is_staff: true,
    password: password
  });

  return admin.save(err => {
    if (err) {
      console.log("[ERROR] There was an error creating admin.");
      console.log(err.message);
    } else {
      console.log("[SUCCESS] Admin has been created.");
    }
    process.exit();
  });
}

main();
