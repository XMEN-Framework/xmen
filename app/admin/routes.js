/**
* Admin routes
*/
var multipart = require('connect-multiparty');

module.exports = function( app, passport, auth ) {

    var admin = require('./controllers/admin');

    app.get('/admin', auth.requiresAdmin, admin.home);
    app.get('/admin/login', admin.login);
};
