/**
 * Admin exceptions.
 */
"use strict";

const { XMENException } = require("../../core/exceptions");

class ModelAlreadyRegistered extends XMENException {}

module.exports = {
  ModelAlreadyRegistered
};
