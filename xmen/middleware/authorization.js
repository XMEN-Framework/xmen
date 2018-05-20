/**
 * Generic require login routing middleware
 */
var mongoose = require('mongoose');


/**
 * Check if the request has an authenticated user.
 */
exports.requiresLogin = function( req, res, next ) {
	//Not authenticated, send to login.
	if ( !req.isAuthenticated() ) {
		return res.status(401).send({
            message: 'Authentication credentials were not provided.'
        });
	}
	next();
};


/**
 * Check if the request has an authenticated admin user.
 */
exports.requiresAdmin = function( req, res, next ) {
	//Not authenticated, send to login.
	if ( req.user ) {
		if ( !req.user.is_superuser ) {
			return res.status(401).send({
                message: 'Authentication credentials were not provided.'
            });
		}
	} else {
        return res.status(401).send({
            message: 'Authentication credentials were not provided.'
        });
    }
	next();
};


/**
 * Check if the request has an authenticated header token.
 */
exports.requiresToken = function( req, res, next ) {
    var authHeader = req.headers.authorization;
    if ( !authHeader ) {
        return res.status(401).send({
            message: 'Authentication credentials were not provided.'
        });
    }

    var authToken = authHeader.split(' ')[1];

    if ( !authToken ) {
        return res.status(401).send({
            message: 'Authentication credentials were not provided.'
        });
    }

    Token.findOne({ value: authToken })
        .populate('user')
        .exec(function( err, token ) {
            if ( err ) {
                return res.send(401, {
                    message: 'Invalid token.'
                });
            }

            if ( !token ) {
                return res.send(401, {
                    message: 'Invalid token.'
                });
            }

            req.token = token;
            req.user = token.user;

            next();
        });
};