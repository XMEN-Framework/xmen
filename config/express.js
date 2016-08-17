/**
 * Express configuration
 */
var express = require('express'),
	path = require('path'),
	swig = require('swig'),
	session = require('express-session'),
	compression = require('compression'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	methodOverride = require('method-override'),
	mongoStore = require('connect-mongo')(session),
	flash = require('connect-flash');


module.exports = function( app, config, passport ) {
	//Save the configs for later usage.
	app.set('config', config);

	app.set('showStackError', true);

	//Compress static files/json data.
	app.use(compression({
		filter: function ( req, res ) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	//Set the static root to server static files
	app.use(express.static(config.STATIC_ROOT));

	//Don't user logged for test env
	if ( process.env.NODE_ENV !== 'test' ) {
		app.use(morgan('dev'));
	}

	//Set the templating engine.
	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');

	if ( process.env.NODE_ENV == 'production' ) {
		//Cache templates.
		app.set('view cache', true); //Enable Express template cache
		swig.setDefaults({ cache: false }); //Disable swig template cache.
	} else {
		//Disable template cache in any other mode.
		app.set('view cache', false);
		swig.setDefaults({ cache: false }); //Disable swig template cache.
	}


	//Enable jsonp
	app.enable("jsonp callback");

	app.locals.appENV = process.env.NODE_ENV;

	//Cookie Parser
	app.use(cookieParser());

	//Connect body parser
	app.use(bodyParser.json({limit: config.MAX_FILE_SIZE})); //10 MB
	app.use(bodyParser.urlencoded({ extended: true }));

	app.use(methodOverride());

	if ( config.DB ) {
		//Express/Mongo Session Storage
		app.use(session({
			secret: config.SECRET,
			store: new mongoStore({
				url: config.DB,
				collection: 'sessions'
			}),
			resave: true,
			saveUninitialized: true
		}));
	}

	app.use(flash());

	//Use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// Assume 404 since no middleware responded.
	app.use(function( err, req, res, next ) {
		//Log it
		console.log('Inside Express 404');

		//Error page.
		res.status(404).render('404', { error: 'Page not found.'});
	});

	//Assume "not found" in the rror msgs is a 404.
	app.use(function( err, req, res, next ) {
		//Treat as 404
		if ( err.message.indexOf('not found') ) return next();

		//Log it
		console.log( err.stack );

		//Error page.
		res.status(500).render('500', { error: err.stack });
	});
};
