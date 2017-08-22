/**
 * XMEN Server
 */

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception!');
    console.log(err);
    console.log(err.stack);
});

var express = require('express'),
    http = require('http'),
    errorhandler = require('errorhandler'),
    passport = require('passport');

var env = process.env.NODE_ENV || 'development';
var configFile = require('./config/config.js');
var config = configFile[env];

var mongoose = require('mongoose');

var db = mongoose.connect(config.DB, (err) => {
    if (err) throw err;
}).connection;

db.on('error', (err) => console.log(err.message));
db.on('open', () => console.log("MongoDB connection open"));
db.on('close', () => console.log("MongoDB connection closed"));

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

require('./config/express')(app, config, passport);

require('./app/models');

require('./config/passport')(passport, config);

var auth = require('./config/middleware/authorization');

require('./app/routes')(app, passport, auth);

app.set('views', './app/views');

var User = mongoose.model('User');

exports = module.exports = app;