var routes = require('require-dir')();

module.exports = function(app, passport, auth) {
  // Initialize all routes
  Object.keys(routes).forEach(function(routeName) {
    require('./' + routeName)(app, passport, auth);
  }); 
};