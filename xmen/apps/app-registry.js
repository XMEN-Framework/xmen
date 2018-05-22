/**
 * XMEN Core apps registry module for loading installed apps.
 */

const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");

const { AppHasBeenRegistered, AppFailedToRegister } = require("./exceptions");

class AppRegistryModule {
  constructor() {
    this.registeredApps = [];
    this.appViews = [];
  }

  /**
   * Register an app and throw an execption if already regsitered.
   * @param {*} app
   */
  registerApp(app) {
    // Make sure app hasn't been registered already
    if (this.registeredApps.indexOf(app) > -1) {
      throw new AppHasBeenRegistered(
        `App '${app}' has already been registered`
      );
      return;
    }

    // Require the app.
    let appPath = app;
    try {
      require(appPath);
    } catch (e) {
      // Can't be resolved by default path, try relative.
      try {
        appPath = xmen.config.rootPath + "/" + app;
        require(appPath);
      } catch (e) {
        throw new AppFailedToRegister(
          `App '${app}' failed to register: \n` + e.message
        );
        return;
      }
    }

    // Load all models in app.
    this.loadModels(appPath);

    this.registeredApps.push(app);
  }

  /**
   * Register all the apps provided.
   * @param {*} apps
   */
  registerApps(apps) {
    apps.map(app => this.registerApp(app));
  }

  /**
   * If a models path exists in the app, load all models.
   * @param {*} app
   */
  loadModels(app) {
    let modelsPath = `${app}/models`;
    try {
      if (fs.existsSync(modelsPath)) {
        fs.readdirSync(modelsPath).forEach(file => {
          if (file) {
            let modelFile = `${modelsPath}/${file}`;
            if (fs.existsSync(modelFile)) {
              let modelSchema = require(modelFile);
            }
          }
        });
      }
    } catch (e) {
      throw new AppFailedToRegister(`App ${app} failed to load models.`, {
        modelsPath: `${app}/models`,
        app: app
      });
    }
  }
}

module.exports = {
  AppRegistry: new AppRegistryModule()
};
