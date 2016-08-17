/**
 * Environment Configuration File
 *
 * Set environment variables and config values.
 */

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    fs = require('fs');

module.exports = {
    'ROOT': rootPath,
    'CONFIG_ROOT': rootPath + '/config',
    'APP_ROOT': rootPath + '/app',
    'PUBLIC_ROOT': rootPath + '/public',
    'INSTALLED_APPS': [
        'admin',
        'users',
        'error',
    ]
};
