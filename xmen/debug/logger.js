/**
 * Logger Module for displaying system messages.
 */

class Logger {
    constructor() {}

    log(message) {
        var time = new Date();
        console.log('[XMEN Info] %s - %s', time.toJSON(), message);    
    }

    debug(message) {
        var time = new Date();
        console.log('[XMEN Debug] %s - %s', time.toJSON(), message);
    }

    error(message) {
        var time = new Date();
        console.error('[XMEN Error] %s - %s', time.toJSON(), message);
    }
}


module.exports = new Logger();