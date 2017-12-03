/**
 * XMEN Server
 */

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception!');
    console.log(err);
    console.log(err.stack);
});

var express = require('express');
var http = require('http');
var errorhandler = require('errorhandler');
var passport = require('passport');
var Logger = require('./xmen/debug/logger');
var { Apps } = require('./xmen/core/apps');

var env = process.env.NODE_ENV || 'development';
var configFile = require('./config/config.js');
var config = configFile[env];

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var promise = mongoose.connect(config.DB, {
    useMongoClient: true
});

promise.then((db) => {
    db.on('error', (err) => Logger(err.message));
    db.on('open', () => Logger("MongoDB connection open"));
    db.on('close', () => Logger("MongoDB connection closed"));
}, (err) => {
    Logger("Could not connect to Mongo");
});


var app = express();
app.use(errorhandler({
    showStack: true,
    dumpExceptions: true
}));

var server = null;
var port = process.env.PORT || config.PORT;
server = app.listen(port);
console.log("XMEN server starting on port " + port);


/**
 * App bootstrapping
 */

require('./xmen/express')(app, config, passport);

Apps.setExpressApp(app);
Apps.registerApps(config.INSTALLED_APPS);

exports = module.exports = app;