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

    // Load all models in app.
    this.loadModels(app);

    // Load all routes in app.
    this.loadRoutes(app);

    this.registeredApps.push(app);
  }

  /**
   * Register all the apps provided.
   * @param {*} apps
   */
  registerApps(apps) {
    apps.map(app => this.registerApp(app));

    // Set the views.
    xmen.app.set("views", xmen.config.appRoot);
  }

  /**
   * If a models path exists in the app, load all models.
   * @param {*} app
   */
  loadModels(app) {
    let modelsPath = `${xmen.config.appRoot}/${app}/models`;
    const ContentType = mongoose.model("ContentType");
    const Permission = mongoose.model("Permission");
    try {
      if (fs.existsSync(modelsPath)) {
        fs.readdirSync(modelsPath).forEach(file => {
          if (file) {
            let modelFile = `${modelsPath}/${file}`;
            if (fs.existsSync(modelFile)) {
              let modelSchema = require(modelFile);

              ContentType.addModel(
                app,
                modelSchema.collection.name,
                (err, model) => {
                  // Permissions create from model.
                  Permission.createModelPermissions(
                    model,
                    modelSchema.collection.name
                  );
                }
              );
            }
          }
        });
      }
    } catch (e) {
      throw new AppFailedToRegister(`App ${app} failed to load models.`, {
        modelsPath: `${xmen.config.appRoot}/${app}/models`,
        app: app
      });
    }
  }

  /**
   * If a routes file exists in the app, load the routes.
   * @param {*} app
   */
  loadRoutes(app) {
    let routesFile = `${xmen.config.appRoot}/${app}/routes`;
    try {
      require(routesFile);
    } catch (e) {
      console.log(e.message);
      throw new AppFailedToRegister(`App ${app} failed to load routes.`, {
        app: app,
        routesFile: routesFile
      });
    }
  }
}

module.exports.AppRegistry = new AppRegistryModule();
