# XMEN Framework

XMEN = Any-Frontend Mongo Express NodeJS

Website: [xmen.io](http://xmen.io)


## Installation

XMEN requires [MongoDB](https://www.mongodb.org/) and [NodeJS](https://nodejs.org/) to be installed.

    npm install xmenio


## Project Configuration

You must define a project configuration file that is set up for XMEN. A default
config file looks like this:

    // config.js

    var path = require('path'),
        rootPath = path.normalize(__dirname);

    module.exports = {
        'development': {
            'DB': 'mongodb://localhost/xmen',       //MongoDB connection
            'PORT': 8000,                           //Port to run XMEN on
            'SECRET': 'xmen',                       //Provide a project secret
            'APP_ROOT': rootPath + '/app',          //Define a custom app path
            'STATIC_ROOT': rootPath + '/public',    //Define a custom static file path
            'PUBLIC_URL': 'http://localhost:8000',  //Public URL
            'INSTALLED_APPS': [                     //Apps to be registered
                'custom_app'
            ]
        }
    };

These are the project settings that are available to any installed app. Extend
this configuration to provide custom project values.


## Start The App

XMEN needs to be bootstrapped and there is a simple way to start the server.

    // app.js

    var XMEN = require('xmenio'),
        config = require('./config.js');

    XMEN.assemble(config); //This initializes the XMEN app

Simply run `node app.js` to get the server up and running.


## Project Structure

XMEN is comprised of smaller individually accessible apps and app must be installed
for it to be used.

Apps must be registered in `INSTALLED_APPS`. App names are based on the directory name.

Example project structure of using the `config.js` above:

    project-name/
        app/
            custom_app/
        config/
            config.js
        node_modules/
        app.js
        package.json


## Models

Registering models within XMEN works by setting up a Mongoose Schema. These models
are automatically loaded.

Include a `models.js` file within an app folder.


## Routes

XMEN apps can provide custom routes that are strucutred specifically for each app.
These routes are automatically loaded.

Include a `routes.js` file within an app folder.

A routes module is passed the `app`, `passport`, and `auth` middleware.


## Templates

XMEN templates are rendered from a registered app's `templates/` directory.
