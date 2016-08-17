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


exports.requiresAdmin = function( req, res, next ) {
	//Not authenticated, send to login.
	if ( !req.isAuthenticated() ) {
		return res.redirect('/admin/login');
	} else if ( req.user ) {
		if ( !req.user.is_superuser ) {
			return res.redirect('/admin/login');
		}
	}
	next();
};
