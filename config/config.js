// config.js

var path = require('path'),
rootPath = path.normalize(__dirname + '/..');

module.exports = {
    'development': {
        'DB': 'mongodb://localhost/xmen',
        'PORT': 8000,
        'SECRET': 'xmen',              
        'APP_ROOT': rootPath + '/app',          
        'STATIC_ROOT': rootPath + '/public',    
        'PUBLIC_URL': 'http://localhost:8000'
    }
};