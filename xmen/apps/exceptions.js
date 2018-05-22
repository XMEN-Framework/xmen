/**
 * The installed apps have not been registered.
 */
const { XMENException } = require("../core/exceptions");

class AppsNotRegistered extends XMENException {}

class AppHasBeenRegistered extends XMENException {}

class AppFailedToRegister extends XMENException {}

class AppDoesNotExist extends XMENException {}

module.exports = {
  AppsNotRegistered,
  AppHasBeenRegistered,
  AppFailedToRegister,
  AppDoesNotExist
};
