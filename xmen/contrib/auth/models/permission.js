/**
 * Permission model
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PermissionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
    // Example 'Can vote'
  },
  value: {
    type: String,
    required: true,
    unique: true
  },
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true
    }
  ],

  created_at: {
    type: Date,
    default: new Date()
  },
  updated_at: {
    type: Date,
    default: new Date()
  }
});

PermissionSchema.statics = {
  /**
   * Add a permission.
   */
  create: function(permission, cb = function() {}) {
    let newPermission = new this(permission);
    newPermission.save(cb);
  },

  /**
   * Create permissions from model.
   */
  createModelPermissions: function(model, cb = function() {}) {
    let modelName = model.model.replace("_", " ");
    let modelValue = model.model;

    this.create({
      name: ` Can add ${modelName}`,
      value: `can_add_${modelValue}`
    });

    this.create({
      name: ` Can edit ${modelName}`,
      value: `can_edit_${modelValue}`
    });

    this.create({
      name: ` Can delete ${modelName}`,
      value: `can_delete_${modelValue}`
    });
  }
};

module.exports = mongoose.model(
  "Permission",
  PermissionSchema,
  "xmen_permissions"
);
