var BaseLayoutView = require('./BaseLayoutView'),
    app = require('app/app'),
    //paper = require('paper'),
    template = require('templates/about.hbs'),
    channels = require('channels'),
    helpers = require('../utils/helpers');

module.exports = BaseLayoutView.extend({

    className: 'page page-about',

    template: template,

    ui: {},

    events: {},

    initialize: function () {},

    onBeforeRender: function () {},

    onRender: function () {
        _.defer(_.bind(function () {
            helpers.setMeta(this.options.title);
        }, this));
    },

    onShow: function () {
        helpers.scrollTo('.header');
    },

    onBeforeDestroy: function () {},

    onDestroy: function () {},

});
