var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    config = require('config'),
    moment = require('moment'),
    debug = require('debug')('http');

//Detect NODE_ENV
switch(config.util.getEnv('NODE_ENV')){
    case 'dev':
        var configDB = config.get('Dev')
        break;

    case 'production':
        
        break;

    default:
        console.log('env error');
}


var calendarSchema = new Schema({ 
    title: String,
    start: Date,
    end: Date,
    date: Date,
    time: String,
    service: String,
    email: String,
    phone: String,
    request: String,
    slug: String,
    reserved: false,
    updated: { 
        type: Date, 
        default: Date.now 
    }
});

/** Validations **/
calendarSchema.path('title').required(true, 'Name cannot be blank');
calendarSchema.path('date').required(true, 'Date cannot be blank');
calendarSchema.path('service').required(true, 'Service cannot be blank');
calendarSchema.path('email').required(true, 'Email cannot be blank');

/**
 * Methods
 */
calendarSchema.methods = {
    uploadAndUpdate: function(images, cb) {
        var self = this;

        self.slug = self.title.toLowerCase().split(' ').join('-').replace(/[^a-zA-Z0-9-_]+/ig, '');

        self.validate(function(err) {
            if (err) return cb(err);

            var startDateAndTime = moment(self.date).hour(self.time);
            var endDateAndTime = moment(startDateAndTime).add(1, 'h');

            self.start = startDateAndTime;
            self.end = endDateAndTime;
            self.reserved = true;

            self.save(cb);
        });
    }
};

calendarSchema.statics = {
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
module.exports = mongoose.model('Calendar', calendarSchema);
