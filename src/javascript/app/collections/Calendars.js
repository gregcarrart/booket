var BaseCollection = require('collections/BaseCollection'),
    _ = require('lodash'),
    Promise = require('bluebird'),
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
    }
});
