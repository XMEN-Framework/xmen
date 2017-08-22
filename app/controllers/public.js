/**
 * Public controller
 */
var mongoose = require('mongoose');

exports.homePage = (req, res) => {
    res.render('public/home');
};