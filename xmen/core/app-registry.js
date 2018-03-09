/**
 * XMEN Core apps registry module for loading installed apps. 
 */

var fs = require('fs');
var express = require('express');

var { AppHasBeenRegistered, AppFailedToRegister } = require('./exceptions');


class AppRegistryModule {

    constructor() {
        this.registeredApps = [];
        this.appViews = [];
        this.expressApp = null;
        this.config = null;
    }


    /**
     * Set the express app on this module.
     * @param {*} app 
     */
    setExpressApp(app) {
        this.expressApp = app;
        this.config = app.get('config');
    }


    /**
     * Register an app and throw an execption if already regsitered.
     * @param {*} app 
     */
    registerApp(app) {
        // Make sure app hasn't been registered already
        if (this.registeredApps.indexOf(app) > -1) {
            throw new AppHasBeenRegistered(`App '${app}' has already been registered`);
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
        for(let app, i = 0; app = apps[i]; i++) {
            this.registerApp(app);
        }

        // Set the views.
        this.expressApp.set('views', this.config.APP_ROOT);
    }


    /**
     * If a models path exists in the app, load all models.
     * @param {*} app 
     */
    loadModels(app) {
        let modelsPath = `${this.config.APP_ROOT}/${app}/models`;
        try {
            if (fs.existsSync(modelsPath)) {
                fs.readdirSync(modelsPath).forEach((file) => {
                    if (file) {
                        let modelFile = `${modelsPath}/${file}`;
                        if (fs.existsSync(modelFile)) {
                            require(modelFile);
                        }
                    }
                });
            }
        } catch (e) {
            throw new AppFailedToRegister(`App ${app} failed to load models.`, {
                modelsPath: `${this.config.APP_ROOT}/${app}/models`,
                app: app,       
            });
        }
    }


    /**
     * If a routes file exists in the app, load the routes.
     * @param {*} app 
     */
    loadRoutes(app) {
        let routesFile = `${this.config.APP_ROOT}/${app}/routes`;
        try {
            require(routesFile)(this.expressApp);
        } catch(e) {
            throw new AppFailedToRegister(`App ${app} failed to load routes.`, {
                app: app,
                routesFile: routesFile
            });
        }
    }
}

module.exports.AppRegistry = new AppRegistryModule();