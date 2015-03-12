/**
 * User Controller
 */
"use strict";

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	moment = require('moment'),
	crypto = require('crypto'),
	_ = require('underscore');


/**
 * Search users.
 */
exports.find = function( req, res ) {
	var query = req.query;

	User.find(query)
	.exec(function( err, users ) {

		if ( err ) return next(err);

        res.jsonp(users);
	});
};


/**
* Populate the request with a user if a user_id param is found.
*/
exports.user = function(req, res, next, id) {
	User
	.findOne({
		_id: id
	})
	.exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));

		req.profile = user;
		next();
	});
};


/**
 * Return a single user
 */
exports.get = function( req, res ) {
	res.jsonp(req.profile);
};

/**
 * Authorization callback
 */
exports.authCallback = function( req, res, next ) {
	//Once logged in, send them to dashboard.
	res.redirect('/');
};


/**
* Login redirect
*/
exports.login = function( req, res ) {
	//Login is successful, redirect to dashboard.

	//Update user last login date.
	req.user.last_login = new Date();
	req.user.save();

	res.jsonp(req.user);
};


/**
* Logout
*/
exports.logout = function( req, res ) {
	//Logout of the app.
	req.logout();
	res.jsonp(1);
};


/**
 * Get currently logged in user.
 */
exports.me = function( req, res ) {
	res.jsonp(req.user);
};


/**
* Get currently logged in user.
*/
exports.meUpdate = function( req, res ) {
	User.findOne({ _id: req.user._id })
		.exec( function( err, user ) {

			user.first_name = req.body.first_name;
			user.last_name = req.body.last_name;

			user.save();

			res.jsonp(user);
		});
};
