/**
 * Passport Configuration
 */
var mongoose = require('mongoose'),
	LocalStrategy = require('passport-local').Strategy,
	User = mongoose.model('User');


module.exports = function( passport, config ) {

	//Serialize sessions
	passport.serializeUser(function( user, next ) {
		next(null, user.id);
	});

	//Deserialize session
	passport.deserializeUser(function( id, next ) {
		User.findOne({ _id: id })
			.exec( function( err, user ) {
				next(err, user);
			});
	});

	//Use local strategy
	passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
	},
	function( username, password, next ) {
		var query = (username.indexOf('@') === -1) ? {username: username} : {email: username};

		User.findOne(query)
			.select('hashed_password provider salt email')
			.exec( function( err, user ) {
				//Error, just return
				if ( err ) return next(err);

				//If no user found.
				if ( !user ) {
					return next(null, false, { message: "Username or password is incorrect." });
				}

				//Can't be authenticated (wrong password?)
				if ( !user.authenticate(password) ) {
					return next(null, false, { message: "Username or password is incorrect." });
				}

				//Logged in, continue.
				return next( null, user );
			});

	}));
};
