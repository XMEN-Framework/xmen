/**
* API routes
*/
"use strict";

var multipart = require('connect-multiparty');

module.exports = function( app, passport, auth ) {

    var authController = require('../controllers/auth');

    app.get('/api/auth/me', auth.requiresToken, authController.me);
    app.post('/api/auth/login', passport.authenticate('local', {}), authController.login);
    app.post('/api/auth/register', authController.register);
    app.patch('/api/auth/me', auth.requiresToken, authController.updateMe);
    app.post('/api/auth/password', auth.requiresToken, authController.changePassword);
};