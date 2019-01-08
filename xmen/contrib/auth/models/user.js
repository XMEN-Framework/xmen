/**
 * User Model
 */
"use strict";

var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  crypto = require("crypto");

var UserSchema = new Schema({
  first_name: {
    type: String,
    default: ""
  },
  last_name: {
    type: String,
    default: ""
  },
  username: {
    type: String,
    text: true,
    unique: true
  },
  email: {
    type: String,
    text: true,
    unique: true
  },

  active: {
    type: Boolean,
    default: true
  },

  is_superuser: {
    type: Boolean,
    default: false
  },

  is_staff: {
    type: Boolean,
    default: false
  },

  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group"
    }
  ],

  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission"
    }
  ],

  //Access
  last_login: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  },
  created_at: {
    type: Date,
    default: Date.now()
  },

  //Password
  password_reset_token: {
    type: String,
    select: false
  },
  hashed_password: {
    type: String,
    select: false
  },
  salt: {
    type: String,
    select: false
  }
});

UserSchema.virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

UserSchema.virtual("full_name").get(function() {
  try {
    var fullName = this.first_name + " " + this.last_name;
    return fullName;
  } catch (e) {
    return "";
  }
});

/**
 * Validations
 */

var validatePresenceOf = function(value) {
  return value && value.length;
};

//The below 4 validations only apply if you are signing up traditionally.

UserSchema.path("email").validate(function(email) {
  return email.length;
}, "Email cannot be blank.");

UserSchema.path("hashed_password").validate(function(password) {
  return password.length;
}, "Password cannot be blank.");

/**
 * Pre Save Hooks
 */
UserSchema.pre("save", function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password)) next(new Error("Invalid password"));
  else next();
});

/**
 * User Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - Check if the passwords are the same.
   *
   * @param {String} plainText
   * @returns {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @returns {String}
   */
  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @returns {String}
   */
  encryptPassword: function(password) {
    if (!password) return "";
    return crypto
      .createHmac("sha1", this.salt)
      .update(password)
      .digest("hex");
  },

  /**
   * Set the permissions on this user.
   */
  setPermissions: function(permissions, cb) {
    this.permissions = permissions;
    this.save(cb);
  },

  /**
   * Add a permission to this user.
   */
  addPermission: function(permission, cb) {
    this.permissions.push(permission);
    this.save(cb);
  },

  /**
   * Remove a permission from this user.
   */
  removePermission: function(premission, cb) {
    let permissions = this.permissions.filter(p => {
      if (p !== permission) return true;
      return false;
    });
    this.permissions = permissions;
    this.save(cb);
  },

  /**
   * Check if user has permission.
   */
  hasPermission: function(permission) {
    let exists = false;
    for (var i = 0; i < this.permissions.length; i++) {
      if (this.permissions[i] === permission) {
        exists = true;
        break;
      }
    }

    return exists;
  },

  /**
   * Set the groups on this user.
   */
  setGroups: function(groups, cb) {
    this.groups = groups;
    this.save(cb);
  },

  /**
   * Add a group to this user.
   */
  addGroup: function(group, cb) {
    this.groups.push(group);
    this.save(cb);
  },

  /**
   * Remove a group from this user.
   */
  removeGroup: function(premission, cb) {
    let groups = this.groups.filter(g => {
      if (g !== group) return true;
      return false;
    });
    this.groups = groups;
    this.save(cb);
  },

  /**
   * Check if user is in a group.
   */
  hasGroup: function(group) {
    let exists = false;
    for (var i = 0; i < this.groups.length; i++) {
      if (this.groups[i] === group) {
        exists = true;
        break;
      }
    }

    return exists;
  }
};

/**
 * Static Methods
 */

UserSchema.statics.makeSalt = function() {
  return Math.round(new Date().valueOf() * Math.random()) + "";
};

//Register the model.
module.exports = mongoose.model("User", UserSchema, "xmen_users");
