/**
 * Global XMEN exception and warning classes.
 */


/**
 * Base XMEN Exception
 */
class XMENException {
    constructor(message, extra) {
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message;
        this.extra = extra;
    }
}


/**
 * The requested model field does not exist.
 */
class FieldDoesNotExist extends XMENException {
}


/**
 * The installed apps have not been registered.
 */
class AppsNotRegistered extends XMENException {
}


/**
 * App has already been registered.
 */
class AppHasBeenRegistered extends XMENException {
}


/**
 * App failed to register.
 */
class AppFailedToRegister extends XMENException {
}


module.exports = {
    XMENException: XMENException,
    FieldDoesNotExist: FieldDoesNotExist,
    AppsNotRegistered: AppsNotRegistered,
    AppHasBeenRegistered: AppHasBeenRegistered,
    AppFailedToRegister: AppFailedToRegister
};