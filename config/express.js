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
	flash = require('connect-flash'),
	helmet = require('helmet');


module.exports = function( app, config, passport ) {
	//Save the configs for later usage.
	app.set('config', config);

	//Show stack error
	app.set('showStackError', true);

	//Include helmet
	app.use(helmet());

	//Compress static files.
	app.use(compression({
		filter: function ( req, res ) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	//Set the static root to serve static files
	app.use(express.static(config.STATIC_ROOT));

	app.use(morgan('dev'));

	//Set the templating engine.
	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');

	//Disable view cache.
	app.set('view cache', false);
	swig.setDefaults({ cache: false }); //Disable swig template cache.

	//Enable jsonp
	app.enable("jsonp callback");

	//Save the app env
	app.locals.appENV = process.env.NODE_ENV;

	//Cookie Parser
	app.use(cookieParser());

	//Connect body parser
	app.use(bodyParser.json({limit: 10000000})); //10 MB
	app.use(bodyParser.urlencoded({ extended: true }));

	//Use method override
	app.use(methodOverride());

	//Store sessions if DB exists.
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

	//Use flash messages
	app.use(flash());

	//Use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// 404
	app.use(function( err, req, res, next ) {
		//Log it
		console.log(err.stack);

		//Error page.
		res.status(404).render('404', { error: 'Page not found.'});
	});

	// 500
	app.use(function( err, req, res, next ) {
		//Treat as 404
		if ( err.message.indexOf('not found') ) return next();

		//Log it
		console.log( err.stack );

		//Error page.
		res.status(500).render('500', { error: err.stack });
	});
};
