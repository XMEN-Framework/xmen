var models = require('require-dir')();

module.exports = function() {
  
  // Initialize all models
  Object.keys(models).forEach(function(modelName) {
    require('./' + modelName);
  }); 
};