/**
 * Content Type
 */
"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ContentTypeSchema = new Schema({
    app: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    }
});


ContentTypeSchema.statics = {

    addModel: function(app, model, cb = function() {}) {
        // Find the content type that matches.
        return this.findOne({
            app: app,
            model: model
        })
        .exec((err, foundModel) => {
            if (err) return cb(err);
            if (foundModel) return cb(null, foundModel);

            // Create new content type.
            let newContentType = new this({
                app: app,
                model: model
            });

            newContentType.save(cb);
        })
    }
}

module.exports = mongoose.model('ContentType', ContentTypeSchema, 'xmen_content_types');