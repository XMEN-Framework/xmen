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

module.exports = {
  XMENException
};
