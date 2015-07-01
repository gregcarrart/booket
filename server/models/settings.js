// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var infoSchema = mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    hours: {
        type: Object,
        default: {
            monday: {
                open: '',
                close: ''
            },
            tuesday: {
                open: '',
                close: ''
            },
            wednesday: {
                open: '',
                close: ''
            },
            thursday: {
                open: '',
                close: ''
            },
            friday: {
                open: '',
                close: ''
            },
            saturday: {
                open: '',
                close: ''
            },
            sunday: {
                open: '',
                close: ''
            }
        }
    },
    closed: {
        type: Array,
        default: ['']
    },
    services: {
        type: Array,
        default: ['']
    },
    headerImage: {
        type: String,
        default: ''
    },
    logo: {
        type: String,
        default: ''
    },
    showServices: {
        type: Boolean,
        default: true
    },
    showPhone: {
        type: Boolean,
        default: true
    },
    showRequests: {
        type: Boolean,
        default: true
    },
    showMap: {
        type: Boolean,
        default: true
    },
    showHeaderImage: {
        type: Boolean,
        default: true
    },
    showLogo: {
        type: Boolean,
        default: true
    },
    user: {
        type: String,
        default: ''
    }
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
