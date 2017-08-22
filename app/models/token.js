/**
* API Token Model
*/

var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

module.exports = mongoose.model('Token', TokenSchema);
