var app = require('app/app'),
    $ = require('jquery'),
    _ = require('lodash'),
    template = require('templates/work-detail.hbs'),
    Marionette = require('backbone.marionette'),
    helpers = require('../utils/helpers'),
    BaseLayoutView = require('./BaseLayoutView');

app.registerPreloader('workDetail', {
    collections: ['projects'],
    waitCount: 1,
    routeDependent: true
}, function (projects, params) {
    return projects.getBySlug(params.slug).get('postImages');
});

module.exports = BaseLayoutView.extend({

    className: 'work-item',

    template: template,

    templateHelpers: function() {
        return {
            postImages: this.model.get('postImages')
        }
    },

    initialize: function () {
        console.log(this.model.get('postImages'));
    },

    onRender: function () {
        _.defer(_.bind(function () {
            helpers.setMeta(this.options.title);
        }, this));
    },

    onShow: function () {
        helpers.scrollTo('.header');
    }
});
