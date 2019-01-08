/**
 * Admin site
 */
"use strict";

const { ModelAlreadyRegistered } = require("./exceptions");

class AdminSite {
  constructor() {
    this.registry = {};
  }

  /**
   * Registers a new model with an admin class configuration
   * on how to be handled in the admin.
   * @param {*} mongooseModel
   * @param {*} adminClass
   * @param {*} options
   */
  register(mongooseModel, adminClass, options) {
    if (this.isRegistered(mongooseModel)) {
      throw new ModelAlreadyRegistered(
        `The model ${mongooseModel} is already registered.`
      );
    }

    this.registry[mongooseModel.modelName] = new adminClass(
      mongooseModel,
      this
    );
  }

  unregister(mongooseModel) {
    delete this.registry[mongooseModel];
  }

  isRegistered(mongooseModel) {
    return !!this.registry[mongooseModel.modelName];
  }
}

module.exports.AdminSite = new AdminSite();
