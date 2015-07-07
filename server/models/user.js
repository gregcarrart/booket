// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local: {
        email        : String,
        password     : String
    },
    name: String,
    settings: {
        businessName: {
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
            type: Array,
            default: {
                'monday': {
                    'open':'900',
                    'close':'1700'
                },
                'tuesday': {
                    'open':'900',
                    'close':'1700'
                },
                'wednesday': {
                    'open':'900',
                    'close':'1700'
                },
                'thursday': {
                    'open':'900',
                    'close':'1700'
                },
                'friday': {
                    'open':'900',
                    'close':'1700'
                },
                'saturday': {
                    'open':'900',
                    'close':'1700'
                },
                'sunday': {
                    'open':'900',
                    'close':'1700'
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
        user: String,
    },
    slug: String
});

/**
 * Methods
 */
userSchema.methods = {
    uploadAndUpdate: function(images, cb) {
        var self = this;

        self.validate(function(err) {
            if (err) return cb(err);

            self.slug = self.name.toLowerCase().split(' ').join('-').replace(/[^a-zA-Z0-9-_]+/ig, '');

            self.local.email = self.email;
            self.local.password = bcrypt.hashSync(self.password, bcrypt.genSaltSync(8), null);

            self.save(cb);
        });
    },

    generateHash: function(password) {
    	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },

    validPassword: function(password) {
    	return bcrypt.compareSync(password, this.local.password);
    }
};

userSchema.statics = {
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
module.exports = mongoose.model('User', userSchema);
