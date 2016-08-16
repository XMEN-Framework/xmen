/**
 * XMEN App.
 *
 */

//Load dependent modules
var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	http = require('http'),
	errorhandler = require('errorhandler'),
	passport = require('passport');


// XMEN APP
var XMEN = {
	env: process.env.NODE_ENV || 'development',
	config: null,
	installed_apps: [],
	routeMiddleware: null,
	app: null,
	bootstrap: function( config ) {
		process.on('uncaughtException', function(err) {
			console.log("Uncaught exception!");
			console.log(err);
			console.log(err.stack);
		});

		this.loadConfig(config); // from require('config.js')
		this.loadDB();
		this.loadExpress();
		this.loadHTTP();
		this.initConfig();
		this.initApps();
	},
	loadConfig: function( config ) {
		this.config = config[this.env];
	},
	loadDB: function() {
		if ( this.config.DB ) {
			//Load middleware and services.
			var mongoose = require('mongoose');

			//Bootstrap DB Connection
			var db = mongoose.connect(this.config.DB, function( err ) {
				if ( err ) throw err;
			}).connection;

			//Set DB connection events.
			db.on('error', function( err ) { console.log(err.message); }); //error
			db.on('open', function( ) { console.log("MongoDB connection open."); }); //open connection
			db.on('close', function( ) { console.log("MongoDB connection closed."); }); //close connection
		}
	},
	loadExpress: function() {
		//Bootstrap Express app.
		this.app = express();
		this.app.use(errorhandler({
			showStack: true,
			dumpExceptions: true
		}));
	},
	loadHTTP: function() {
		this.app.listen(this.config.PORT);

		console.log('\n\n=====================================================\n');
		console.log('      _/      _/  _/      _/  _/_/_/_/  _/      _/');
		console.log('       _/  _/    _/_/  _/_/  _/        _/_/    _/');
		console.log('        _/      _/  _/  _/  _/_/_/    _/  _/  _/');
		console.log('     _/  _/    _/      _/  _/        _/    _/_/');
		console.log('  _/      _/  _/      _/  _/_/_/_/  _/      _/');
		console.log('\n=====================================================\n\n');
		console.log('XMEN framework app started on ' + config.APP.url);
	},
	initConfig: function() {
		require('./config/express')(this.app, this.config, passport);
		require('./config/passport')(passport, this.config);
	},
	initApps: function() {
		//Load all installed apps.
		var appViewPaths = [];
		for ( var i = 0, app; app = this.installed_apps[i]; i++ ) {
			try {
				//Load Models
				if ( fs.existsSync(this.config.APP_ROOT + '/' + app + '/models') ) {
					fs.readdirSync(this.config.APP_ROOT + '/' + app + '/models').forEach(function(file) {
						if ( file ) {
							var modelFile = this.config.APP_ROOT + '/' + app + '/models/' + file;
							if ( fs.existsSync(modelFile) ) {
								require(modelFile);
							}
						}
					});
				}

				//Load Routes
				if ( fs.existsSync(this.config.APP_ROOT + '/' + app + '/routes') ) {
					fs.readdirSync(this.config.APP_ROOT + '/' + app + '/routes').forEach(function(file) {
						if ( file ) {
							var modelFile = this.config.APP_ROOT + '/' + app + '/routes/' + file;
							if ( fs.existsSync(modelFile) ) {
								require(modelFile)(this.app, passport, this.routeMiddleware);
							}
						}
					});
				}

				//Load Views
				appViewPaths.push(config.APP_ROOT + '/' + app + '/views');
			} catch ( e ) {
				console.log("Failed loading app: ", app);
				console.error(e.stack);
			}
		}

		//Set view paths.
		app.set('views', componentViewPaths);
	}

};

//Expose app.
exports = module.exports = XMEN;
