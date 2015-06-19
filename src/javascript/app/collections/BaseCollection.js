var Backbone = require('backbone'),
    _ = require('lodash'),
    Bluebird = require('bluebird'),
    constants = require('utils/constants');

module.exports = Backbone.Collection.extend({

    initDeferred: function () {
        this.promise = new Bluebird(_.bind(function (resolve, reject) {
            this.resolve = _.partial(resolve, this);
            this.reject = _.partial(resolve, this);
        }, this));
    },

    url: function () {
        if (this.endpoint.indexOf('.json') > -1) {
            return constants.ASSETS_URL + this.endpoint.substring(1, this.endpoint.length);
        }

        return this.endpoint;
    },

    initialize: function () {
        this.initDeferred();
    },

    fetch: _.wrap(Backbone.Collection.prototype.fetch, function (fetch) {
        if (!this.promise) {
            this.initDeferred();
        }

        var args = Array.prototype.slice.call(arguments, 1);

        fetch.apply(this, args)
            .done(this.resolve)
            .fail(this.reject);

        return this.promise;
    }),

    addFilter: function (key, value) {
        this._filters = this._filters || {};

        if (_.isObject(key)) {
            _.extend(this._filters, key);
        } else {
            if (!_.isUndefined(value)) {
                this._filters[key] = value;
            }
        }
    },

    addFilters: function (filters) {
        this._filters = this._filters || {};

        _.each(filters, _.bind(function (filter) {
            if (!_.isArray(filter)) {
                filter = [filter];
            }

            this.addFilter.apply(this, filter);
        }, this));
    },

    removeFilter: function (filter) {
        this._filters = this._filters || {};

        delete this._filters[filter];
    },

    removeFilters: function (filters) {
        this._filters = this._filters || {};

        _.each(filters, _.bind(function (filter) {
            delete this._filters[filter];
        }, this));
    },

    removeAllFilter: function (key) {
        this._filters = this._filters || {};

        this._filters = {};

        this.applyFilters();
    },

    applyFilters: function () {
        this._filters = this._filters || {};

        if (_.isEmpty(this._filters)) {
            this.reset(this.fullCollection.models);
        } else {
            this.reset(this.fullCollection.where(this._filters));
        }

    },

});
