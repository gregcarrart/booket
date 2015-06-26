var BaseLayoutView = require('./BaseLayoutView'),
    app = require('app/app'),
    template = require('templates/appointment.hbs'),
    channels = require('channels'),
    helpers = require('../utils/helpers');

module.exports = BaseLayoutView.extend({

    className: 'page page-index',

    template: template,

    ui: {
       
    },

    events: {
        'click @ui.arrow': 'onArrowClick'
    },

    initialize: function () {},

    onBeforeRender: function () {},

    onRender: function () {
        _.defer(_.bind(function () {
            helpers.setMeta(this.options.title);
        }, this));
    },

    onShow: function () {
        helpers.scrollTo('.header');
        this.ui.win = $(window);
    },

    onBeforeDestroy: function () {},

    onDestroy: function () {}

});
