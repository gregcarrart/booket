var BaseCollection = require('collections/BaseCollection'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    moment = require('moment'),
    constants = require('utils/constants'),
    Calendar = Backbone.Model;

module.exports = BaseCollection.extend({

    endpoint: '/'+ constants.USER_SLUG +'/events',

    comparator: 'order',

    model: Calendar,

    initialize: function () {
    	this.fullCollection = new Backbone.Collection();

        this.on('sync', _.bind(function () {
            this.fullCollection.reset(this.models);
        }, this));
    },

    getBySlug: function (slug) {
        return this.fullCollection.findWhere({
            slug: slug
        });
    },

    searchByDate: function(date) {
        var searchDate = new Date(date);

        var filteredCollection = _.filter(this.fullCollection.models, function (data) {
            var dateString = data.get('date');
            dateString = dateString.substring(0,10).split('-');
            dateString = dateString[1] + '-' + dateString[2] + '-' + dateString[0];
            
            var dataDate = new Date(dateString);
            
            return moment(searchDate).isSame(dataDate);
        });

        this.reset(filteredCollection);
    }
});
