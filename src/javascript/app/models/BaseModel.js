var Backbone = require('backbone'),
    _ = require('lodash'),
    Bluebird = require('bluebird');

module.exports = Backbone.Model.extend({

    initDeferred: function () {
        this.promise = new Bluebird(_.bind(function (resolve, reject) {
            this.resolve = _.partial(resolve, this);
            this.reject = _.partial(resolve, this);
        }, this));
    },

    initialize: function () {
        this.initDeferred();
    },

    fetch: _.wrap(Backbone.Model.prototype.fetch, function (fetch) {
        if (!this.promise) {
            this.initDeferred();
        }

        var args = Array.prototype.slice.call(arguments, 1);

        fetch.apply(this, args)
            .done(this.resolve)
            .fail(this.reject);

        return this.promise;
    })

});
