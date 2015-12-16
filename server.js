/**
 * XMEN server bootstrap.
 *
 */
"use strict";

process.on('uncaughtException', function(err) {
	console.log("Uncaught exception!!!!");
	console.log(err);
	console.log(err.stack);
});

//Load dependent modules
var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	http = require('http'),
	https = require('https'),
	errorhandler = require('errorhandler'),
	passport = require('passport');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
var env = process.env.NODE_ENV || 'development'; //Default to development mode
var configFile = require('./config/config.js');
var config = configFile[env]; //Set the config variable to the environment setup.

if ( config.hasDB ) {
	//Load middleware and services.
	var mongoose = require('mongoose');

	//Bootstrap DB Connection
	var db = mongoose.connect(config.db, function( err ) {
		if ( err ) throw err;
	}).connection;

	//Set DB connection events.
	db.on('error', function( err ) { console.log(err.message); }); //error
	db.on('open', function( ) { console.log("MongoDB connection open."); }); //open connection
	db.on('close', function( ) { console.log("MongoDB connection closed."); }); //close connection
}

//Bootstrap Express app.
var app = express();
app.use(errorhandler({
	showStack: true,
	dumpExceptions: true
}));

if (config.useSSL) {
	//Set up SSL

	var ca = []; //Certifications

	//Read SSL key and certifications
	var options = {
		key: fs.readFileSync(config.sslKeyPath),
		cert: fs.readFileSync(config.sslCertPath),
		passphrase: config.sslPassphrase
	};

	//Push the ca and certifications to options.
	if ( config.sslCAPath && config.sslRootPath ) {
		ca.push(fs.readFileSync(config.sslCAPath));
		ca.push(fs.readFileSync(config.sslRootPath));

		options.ca = ca;
	}

	//Create HTTP redirect server.
	var http = express.createServer(app);
	//Create HTTPS server
	var https = https.createServer(options, app).listen(config.PORT, function() {
		console.log('XMEN framework app started on ' + config.app.url);
	});

	//Set up route on HTTP to redirect to HTTPS
	http.get('*', function( req, res ) {
		res.writeHead(301, { "Location": config.app.url + req.url });
		res.end();
	});

	//Listen to http on port 80
	http.listen(80);
} else {

	//Create HTTP app.
	app.listen(config.PORT);
	console.log('\n\n=====================================================\n');
	console.log('      _/      _/  _/      _/  _/_/_/_/  _/      _/');
	console.log('       _/  _/    _/_/  _/_/  _/        _/_/    _/');
	console.log('        _/      _/  _/  _/  _/_/_/    _/  _/  _/');
	console.log('     _/  _/    _/      _/  _/        _/    _/_/');
	console.log('  _/      _/  _/      _/  _/_/_/_/  _/      _/');
	console.log('\n=====================================================\n\n');
	console.log('XMEN framework app started on ' + config.app.url);
}


/**
 * App boostrapping.
 */

//Express settings
require('./config/express')(app, config, passport);

//Bootstrap App Models.
fs.readdirSync(config.APP_ROOT).forEach(function( component ) {
	try {
		if ( fs.existsSync(config.APP_ROOT + '/' + component + '/models') ) {
			fs.readdirSync(config.APP_ROOT + '/' + component + '/models').forEach(function( file ) {
				if ( file ) {
					var modelFile = config.APP_ROOT + '/' + component + '/models/' + file;
					if ( fs.existsSync(modelFile) ) {
						require(modelFile);
					}
				}
			});
		}
	} catch ( e ) {
		console.log("Failed loading component: ", component);
		console.error( e.stack );
		//File doesn't exist, skip.
	}
});

//Bootstrap Passport config
require('./config/passport')(passport, config);

//Get the authorization middleware after the models have been loaded.
var auth = require('./config/middleware/authorization');

//Set up the array of view paths.
var componentViewPaths = [];

//Bootstrap App Routes.
fs.readdirSync(config.APP_ROOT).forEach(function( component ) {
	try {
		if ( fs.existsSync(config.APP_ROOT + '/' + component + '/routes') ) {
			fs.readdirSync(config.APP_ROOT + '/' + component + '/routes').forEach(function( file ) {
				//Pass in app, passport and auth.
				if ( file ) {
					try {
						var routeFile = config.APP_ROOT + '/' + component + '/routes/' + file;
						if ( fs.existsSync(routeFile) ) {
							require(routeFile)(app, passport, auth);
						}
					} catch ( e ) {
						console.error( e );
						console.error(e.stack);
					}
				}
			});
		}
	} catch ( e ) {
		//File doesn't exist, skip.
		console.error("Could not load module: ", component);
		console.error( e );
	}
	componentViewPaths.push(config.APP_ROOT + '/' + component + '/views');
});

//Set view paths.
app.set('views', componentViewPaths);

//Expose app.
exports = module.exports = app;
