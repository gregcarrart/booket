// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var infoSchema = mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    hours: Object,
    closed: [String],
    services: [String],
    headerImage: String,
    logo: String,
    showServices: Boolean,
    showPhone: Boolean,
    showRequests: Boolean,
    showMap: Boolean,
    showHeaderImage: Boolean,
    showLogo: Boolean
});

/**
 * Methods
 */
infoSchema.methods = {
    uploadAndUpdate: function(images, cb) {
        var self = this;

        self.validate(function(err) {
            if (err) return cb(err);

            self.save(cb);
        });
    },
};

infoSchema.statics = {
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
module.exports = mongoose.model('Settings', infoSchema);
