/**
 * API Token Model
 */

var mongoose = require("mongoose");

var TokenSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  expires_at: {
    type: Date,
    default: () => {
      let now = new Date();
      now.setHours(now.getHours() + 1); // Default 1 hour expiry.
      return now;
    }
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  updated_at: {
    type: Date,
    default: new Date()
  }
});

TokenSchema.methods.refresh = () => {
  let expiry = new Date();
  expiry.setHours(expiry.getHours() + 1); // Expiry in an hour.
  this.expires_at = expiry;
  this.save();
};

module.exports = mongoose.model("Token", TokenSchema, "xmen_tokens");
