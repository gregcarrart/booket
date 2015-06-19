var Marionette = require('backbone.marionette'),
    $ = require('jquery'),
    _ = require('lodash'),
    helpers = require('../utils/helpers'),
    template = require('templates/blog.hbs'),
    BaseLayoutView = require('./BaseLayoutView');

app.registerPreloader('blog', {
    collections: ['posts'],
    waitCount: 0
}, function (posts) {
    return posts.pluck('file');
});

module.exports = BaseLayoutView.extend({

    className: 'page page-blog',

    template: template,

    templateHelpers: function() {
        return {
            posts: this.collection.toJSON(),
            featured: this.featuredPosts
        };
    },

    ui: {
        
    },

    events: {},

    initialize: function() {
        this.featuredPosts = this.options.featured;
    },

    onRender: function() {
        _.defer(_.bind(function () {
            helpers.setMeta(this.options.title);
        }, this));
    },

    onShow: function() {
        helpers.scrollTo('.header');
    }

});
