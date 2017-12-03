/**
 * Logger Module for displaying system messages.
 */
module.exports = (msg) => {
    var time = new Date();
    console.log('[XMEN Info] %s - %s', time.toJSON(), msg);
};