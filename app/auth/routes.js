/**
 * Authentication routes.
 */

var express = require('express');
var router = express.Router();

module.exports = (app) => {

    var auth = require('./controllers/auth');

    router.get('/login', auth.loginPage);
    router.get('/register', auth.register);
    router.get('/forgot-password', auth.forgotPasswordPage);
    router.get('/reset-password', auth.resetPasswordPage);

    app.use('/auth', router);
}