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

    templateHelpers: function() {
        console.log('hey');
        return {
            times: this.availableTimes
        };
    },

    events: {
        'click @ui.arrow': 'onArrowClick'
    },

    initialize: function () {
        this.availableTimes = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
    },

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

        this.ui.datePicker.change(_.bind(function() {
            this.collection.fetch();
            this.collection.searchByDate(this.ui.datePicker.val());
            this.displayTimes();
        }, this));

    },

    displayTimes: function () {
        this.takenTimes = [];

        _.each(this.collection.models, _.bind(function(model) {
            this.takenTimes.push(model.get('time'));
        }, this));

        this.availableTimes = _.difference(this.availableTimes, this.takenTimes);

    },

    onBeforeDestroy: function () {},

    onDestroy: function () {}

});
