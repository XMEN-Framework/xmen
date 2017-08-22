/**
 * Generic require login routing middleware
 */
var mongoose = require('mongoose');

exports.requiresLogin = function( req, res, next ) {
	//Not authenticated, send to login.
	if ( !req.isAuthenticated() ) {
		return res.status(401).send({
            message: 'Authentication credentials were not provided.'
        });
	}
	next();
};


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