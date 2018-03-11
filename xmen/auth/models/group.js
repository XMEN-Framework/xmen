/**
 * Group model
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var GroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: 'Permission'
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    }
});


/**
 * Mongoose group methods.
 */
GroupSchema.methods = {

    setPermissions: function(permissions, cb) {
        this.permissions = permissions;
        this.save(cb);
    },

    addPermission: function(permission, cb) {
        this.permissions.push(permission);
        this.save(cb);
    },

    removePermission: function(permission, cb) {
        let permissions = this.permissions.filter(p => {
            if (p !== permission)
                return true;
            return false;
        });
        this.permissions = permissions;
        this.save(cb);
    },

    clearPermissions: function(cb) {
        this.permissions = [];
        this.save(cb);
    }
};

module.exports = mongoose.model('Group', GroupSchema, 'xmen_groups');