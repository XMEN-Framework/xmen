/**
* Public routes
*/
"use strict";

var multipart = require('connect-multiparty');

module.exports = function( app, passport, auth ) {

    var publicController = require('../controllers/public');

    app.get('/', publicController.homePage);
    
};