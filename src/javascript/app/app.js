var $ = global.$ = global.jQuery = require('jquery');
var Backbone = require('backbone');
var _ = global._ = require('underscore');
Backbone.$ = $;
var Marionette = require('backbone.marionette');

var Bluebird = require('bluebird');

require('utils/exceptions');
Bluebird.onPossiblyUnhandledRejection(function (error) {
	throw error;
});

// preloaders
var preload = require('utils/imagePreloader');

Marionette.Application.prototype.registerPreloader =
    function (identifier, options, func) {
        var promise;

        this.preloaders = this.preloaders || {};

        options = _.defaults(options || {}, {
            collections: [],
            routeDependent: false, //this is important- if we're waiting on a specific
            waitCount: 5
        });

        options.getImages = func;

        //Intentionally creating a closure so the promise var is maintained between calls;
        options.preload = function (collections, parameters) {
            var collectionsNeeded = _.map(options.collections, function (collection) {
                return collections[collection].promise;
            });

            if (options.routeDependent) {
                if (_.isEmpty(parameters)) {
                    throw "Route parameters must be passed";
                } else {
                    collectionsNeeded.push(parameters);
                    promise = false; //reset it since we have to be able to run this for different routes
                }
            }

            if (!promise) {
                promise = Bluebird.all(collectionsNeeded).spread(options.getImages).then(function (paths) {
                    return preload(paths, options.waitCount);
                }).then(function () {
                    return collectionsNeeded;
                });
            }

            return promise;
        };

        this.preloaders[identifier] = options;
    };

// Transition Regions
var TransitionRegion = require('./regions/TransitionRegion');

var mainTransitionRegion = new Marionette.TransitionRegion({
    el: '#region-main'
});

app = new Marionette.Application();

app.addRegions({
    regionMain: mainTransitionRegion,
    regionHeader: '#region-header',
    regionNav: '#region-nav'
});

app.Behaviors = app.Behaviors || {};

Marionette.Behaviors.behaviorsLookup = function() {
    return app.Behaviors;
};

app.addInitializer(function() {

    Backbone.history.start({
        pushState: true,
        root: '/'
    });

});

module.exports = app;
