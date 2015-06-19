var app = require('app/app'),
    $ = require('jquery'),
    _ = require('lodash'),
    template = require('templates/blog-detail.hbs'),
    Marionette = require('backbone.marionette'),
    helpers = require('../utils/helpers'),
    BaseLayoutView = require('./BaseLayoutView');

app.registerPreloader('blogDetail', {
    collections: ['posts'],
    waitCount: 1,
    routeDependent: true
}, function (posts, params) {
    return posts.getBySlug(params.slug).get('file');
});

module.exports = BaseLayoutView.extend({

    className: 'blog-item',

    template: template,

    onRender: function () {
        _.defer(_.bind(function () {
            helpers.setMeta(this.options.title);
        }, this));
    },

    onShow: function () {
        helpers.scrollTo('.header');
    }
});
