var imgAsync = require('img-async');
var img = require('img');
var Bluebird = require('bluebird');
var _ = require('lodash');
var assetsUrl = require('./assetsUrl');

var preload = module.exports = function (paths, waitOn, concurrency) {
    if (!_.isArray(paths)) {
        paths = [paths];
    }

    paths = _.map(_.unique(_.compact(paths)), assetsUrl);

    concurrency = concurrency || 10;

    if (paths.length === 0) {
        return Bluebird.resolve();
    }

    var promise;
    var count = 0;
    var preloadImages = [];
    var otherImages = [];

    if (waitOn > 0) {
        preloadImages = _.first(paths, waitOn);
        otherImages = _.first(paths, waitOn);
    } else {
        otherImages = paths;
    }

    if (preloadImages.length > 0) {
        promise = Bluebird.settle(_.map(preloadImages, imgAsync));
    } else {
        promise = Bluebird.resolve(true);
    }

    if (otherImages.length > 0) {
        _.map(otherImages, function (path) {
            return img(path);
        });
    }

    return promise;
};
