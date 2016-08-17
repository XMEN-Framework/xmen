/**
 * Admin Controller
 */
exports.home = function( req, res ) {
    res.render('admin', {
        app: req.app.get('config').APP
    });
};

exports.login = function( req, res ) {
    res.render('login', {
        app: req.app.get('config').APP
    });
};
