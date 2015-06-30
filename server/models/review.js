// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var reviewSchema = mongoose.Schema({
    name: String,
    content: String,
    rating: String,
    updated: { 
        type: Date, 
        default: Date.now 
    } 
});

/**
 * Methods
 */
reviewSchema.methods = {
    uploadAndUpdate: function(images, cb) {
        var self = this;

        self.validate(function(err) {
            if (err) return cb(err);

            self.save(cb);
        });
    },
};

reviewSchema.statics = {
    /**
     * Find appointments by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api private
     */

    load: function(id, cb) {
        var self = this;
        this.findById(id)
            .sort('order')
            .populate('items')
            .exec(cb);
    },

    /**
     * List appointments
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    list: function(options, cb) {
        var criteria = options.criteria || {},
            self = this;
        this.find(criteria)
            .sort('order')
            .populate('items')
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    }
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Review', reviewSchema);
