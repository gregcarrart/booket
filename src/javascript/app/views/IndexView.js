var BaseLayoutView = require('./BaseLayoutView'),
    app = require('app/app'),
    template = require('templates/index.hbs'),
    channels = require('channels'),
    paper = require('libs/paper-full.min'),
    helpers = require('../utils/helpers'),
    Velocity = require('velocity-animate');

require('jquery-ui');

module.exports = BaseLayoutView.extend({

    className: 'page page-index',

    template: template,

    ui: {
       datePicker: '#datepicker'
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

        this.ui.datePicker.datepicker();
    },

    onBeforeDestroy: function () {},

    onDestroy: function () {}

});
