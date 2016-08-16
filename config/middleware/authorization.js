/**
 * Generic require login routing middleware
 */
var mongoose = require('mongoose');

exports.requiresLogin = function( req, res, next ) {
	//Not authenticated, send to login.
	if ( !req.isAuthenticated() ) {
		return res.redirect('/login');
	}
	next();
};
