/**
 * Passport Configuration
 */
var mongoose = require('mongoose'),
LocalStrategy = require('passport-local').Strategy,
CookieStrategy = require('passport-cookie').Strategy,
BearerStrategy = require('passport-http-bearer').Strategy,
User = mongoose.model('User');


module.exports = function (passport, config) {

//Serialize sessions
passport.serializeUser(function (user, next) {
	next(null, user.id);
});

//Deserialize session
passport.deserializeUser(function (id, next) {
	User.findOne({ _id: id })
		.exec(function (err, user) {
			next(err, user);
		});
});

//Use local strategy
passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
},
	function (username, password, next) {
		var query = (username.indexOf('@') === -1) ? { username: username } : { email: username };

		User.findOne(query)
			.select('hashed_password provider salt email')
			.exec(function (err, user) {
				//Error, just return
				if (err) return next(err);

				//If no user found.
				if (!user) {
					return next(null, false, { message: "Email or password is incorrect." });
				}

				//Can't be authenticated (wrong password?)
				if (!user.authenticate(password)) {
					return next(null, false, { message: "Username or password is incorrect." });
				}

				return next(null, user);
			});

	}));

//token auth setup
passport.use(new BearerStrategy(
	(token, done) => {
		User.findOne({ access_token: token },
			(err, user) => {
				if (err) return done(err);
				if (!user) return done(null, false);
				return done(null, user, { scope: 'all' })
			}
		);
	})
);
};