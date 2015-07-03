var BaseCollection = require('collections/BaseCollection'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    moment = require('moment'),
    constants = require('utils/constants'),
    User = Backbone.Model;

module.exports = BaseCollection.extend({

    endpoint: '/'+ constants.USER_ID +'/settings',

    comparator: 'order',

    model: User,

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
