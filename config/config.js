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
        'hasDB': false,
        'db': 'mongodb://localhost/xmen', //example: mongodb://localhost/my-db
        'ROOT': rootPath,
        'PORT': 3000,
        'CONFIG_ROOT': rootPath + '/config',
        'APP_ROOT': rootPath + '/app',
        'PUBLIC_ROOT': rootPath + '/public',
        'app': {
            'name': 'XMEN Framework - DEVELOPMENT',
            'url': 'http://localhost:3000'
        },
        'useSSL': false,
        'sslKeyPath': '',
        'sslCertPath': '',
        'sslCAPath': '',
        'sslRootPath': '',
        'sslPassphrase': ''
    },
    'production': {
        'hasDB': false,
        'db': '<mongodb connection>', //example: mongodb://localhost/my-db
        'ROOT': rootPath,
        'CONFIG_ROOT': rootPath + '/config',
        'APP_ROOT': rootPath + '/app',
        'PUBLIC_ROOT': rootPath + '/public',
        'app': {
            'name': 'XMEN Framework',
            'url': 'http://xmen.io'
        },
        'useSSL': false,
        'sslKeyPath': '',
        'sslCertPath': '',
        'sslCAPath': '',
        'sslRootPath': '',
        'sslPassphrase': ''
    }
};
