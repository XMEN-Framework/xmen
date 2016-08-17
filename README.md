# XMEN Framework

XMEN = Any-Frontend Mongo Express NodeJS

Website: [xmen.io](http://xmen.io)


## Installation

XMEN requires [MongoDB](https://www.mongodb.org/) and [NodeJS](https://nodejs.org/) to be installed.

    npm install xmenio


## Project Structure

XMEN is comprised of smaller individually accessible apps, an app must be installed
for it to be used.

All apps must exist within the `app/` directory.


## Models

Registering models within XMEN works by setting up a Mongoose Schema. These models
are automatically loaded.

Include a `models.js` file within an app folder.


## Routes

XMEN apps can provide custom routes that are strucutred specifically for each app.
These routes are automatically loaded.

Include a `routes.js` file within an app folder.


## Templates

XMEN templates are rendered from a registered app's `templates/` directory.
