/**
 * User Model
 */
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');


var UserSchema = new Schema({
    first_name: {
        type: String,
        default: ''
    },
    last_name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        unique: true
    },

    is_superuser: {
        type: Boolean,
        default: false,
    },

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
    access_token: {
        type: String
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


UserSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema.virtual('full_name')
    .get(function () {
        try {
            var fullName = this.first_name + ' ' + this.last_name
            return fullName;
        } catch (e) {
            return '';
        }
    });


/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

//The below 4 validations only apply if you are signing up traditionally.

UserSchema.path('email').validate(function (email) {
  return email.length;
}, 'Email cannot be blank.');

UserSchema.path('hashed_password').validate(function (password) {
  return password.length;
}, 'Password cannot be blank.');


/**
 * Pre Save Hooks
 */
UserSchema.pre('save', function (next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password))
    next(new Error("Invalid password"));
  else
    next();
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
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @returns {String}
   */

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @returns {String}
   */

  encryptPassword: function (password) {
    if (!password) return '';
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  },
};


/**
 * Static Methods
 */

UserSchema.statics.makeSalt = function () {
  return Math.round(new Date().valueOf() * Math.random()) + '';
};


//Register the model.
mongoose.model('User', UserSchema);