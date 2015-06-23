var BaseCollection = require('collections/BaseCollection'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    moment = require('moment'),
    Calendar = Backbone.Model;

module.exports = BaseCollection.extend({

    endpoint: '/api/v1/calendar',

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
        var momentDate = moment(searchDate);

        var filteredCollection = _.filter(this.fullCollection.models, function (data) {
            return moment(searchDate).isSame(data.get('date'));
        });

        this.reset(filteredCollection);
    }
});
