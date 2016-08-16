/**
 * Environment Configuration File
 *
 * Set environment variables and config values.
 */

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    fs = require('fs'),
    nconf = require('nconf');

nconf.use('memory');
nconf.argv();
nconf.env(['PORT']);

module.exports = {
    'development': {
        'DB': 'mongodb://localhost/xmen', //example: mongodb://localhost/my-db
        'ROOT': rootPath,
        'PORT': 3000,
        'CONFIG_ROOT': rootPath + '/config',
        'APP_ROOT': rootPath + '/app',
        'PUBLIC_ROOT': rootPath + '/public',
        'MAX_FILE_SIZE': 10000000,
        'APP': {
            'name': 'XMEN Framework - DEVELOPMENT',
            'url': 'http://localhost:3000'
        }
    },
    'production': {
        'DB': '<mongodb connection>',
        'ROOT': rootPath,
        'PORT': 8000,
        'CONFIG_ROOT': rootPath + '/config',
        'APP_ROOT': rootPath + '/app',
        'PUBLIC_ROOT': rootPath + '/public',
        'MAX_FILE_SIZE': 10000000,
        'APP': {
            'name': 'XMEN Framework',
            'url': 'http://localhost:8000'
        }
    }
};
