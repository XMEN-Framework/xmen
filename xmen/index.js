/**
 * Require the XMEN application and bind to global instance.
 */
"use strict";

/**
 * Create new instance of XMEN application.
 */
module.exports = function(global) {
    try {
        return global.xmen = require('./xmen');
    } catch (e) {
        console.log(e);
    }
}.call(this, global);