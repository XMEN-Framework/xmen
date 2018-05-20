/**
* Public routes
*/
"use strict";

var express = require('express');
var router = express.Router();

module.exports = function(app) {

    var publicController = require('./controllers/public');

    router.get('/', publicController.homePage);

    app.use('/', router);
    
};