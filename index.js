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
	xmenConfig: require('./config/config.js'),
	installedApps: [],
	xmenApps: [],
	routeMiddleware: require('./config/middleware/authorization'),
	app: null,
	appViewPaths: [],
	bootstrap: function( config ) {
		process.on('uncaughtException', function(err) {
			console.log("Uncaught exception!");
			console.log(err);
			console.log(err.stack);
		});

		if ( !config ) {
			console.log('You must provide a config file!');
			return;
		}

		this.loadConfig(config); // from require('config.js')
		this.loadDB();
		this.loadExpress();
		this.loadHTTP();
		this.initExpress();
		this.initCoreApps();
		this.initApps( this.config.APP_ROOT, this.installedApps );
		this.initAppViewPaths();
	},
	loadConfig: function( config ) {
		this.config = config[this.env];
		this.installedApps = this.config.INSTALLED_APPS;
		this.xmenApps = this.xmenConfig.INSTALLED_APPS;
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
		console.log('XMEN framework app started on ' + this.config.APP.url);
	},
	initExpress: function() {
		require('./config/express')(this.app, this.config, passport);
	},
	initCoreApps: function() {
		this.initApps(this.xmenConfig.APP_ROOT, this.xmenApps);
	},
	initApps: function( appRoot, apps ) {
		//Load all installed apps.
		var appViewPaths = [];
		var xmen = this;

		if ( apps.length ) {
			for ( var i = 0, app; app = apps[i]; i++ ) {
				try {
					//Load Models
					if ( fs.existsSync(appRoot + '/' + app + '/models') ) {
						fs.readdirSync(appRoot + '/' + app + '/models').forEach(function(file) {
							if ( file ) {
								var modelFile = appRoot + '/' + app + '/models/' + file;
								if ( fs.existsSync(modelFile) ) {
									require(modelFile);
								}
							}
						});
					}

					//Load Routes
					if ( fs.existsSync(appRoot + '/' + app + '/routes') ) {
						fs.readdirSync(appRoot + '/' + app + '/routes').forEach(function(file) {
							if ( file ) {
								var modelFile = appRoot + '/' + app + '/routes/' + file;
								if ( fs.existsSync(modelFile) ) {
									require(modelFile)(xmen.app, passport, xmen.routeMiddleware);
								}
							}
						});
					}

					//Load Views
					xmen.appViewPaths.push(appRoot + '/' + app + '/views');
				} catch ( e ) {
					console.log("Failed loading app: ", app);
					console.error(e.stack);
				}
			}
		}

		require('./config/passport')(passport, xmen.config);
	},
	initAppViewPaths: function() {
		//Set view paths.
		console.log(this.appViewPaths);
		this.app.set('views', this.appViewPaths);
	}

};

//Expose app.
exports = module.exports = XMEN;
