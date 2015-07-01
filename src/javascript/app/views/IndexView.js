var BaseLayoutView = require('./BaseLayoutView'),
    app = require('app/app'),
    template = require('templates/index.hbs'),
    channels = require('channels'),
    constants = require('utils/constants'),
    paper = require('libs/paper-full.min'),
    helpers = require('../utils/helpers'),
    Appointment = require('../models/Appointment'),
    Velocity = require('velocity-animate');

require('jquery-ui');
require('behaviors/GoogleMap');

module.exports = BaseLayoutView.extend({

    className: 'page page-index',

    template: template,

    ui: {
        mapCanvas: '#map-canvas',
        formDate: '#form-date',
        formTime: '#form-time',
        formTitle: '#form-title',
        formService: '#form-service',
        formEmail: '#form-email',
        formPhone: '#form-phone',
        formRequests: '#form-requests',
        submitBtn: '.submit',
        submitForm: '#form',
        submitMessage: '#message'
    },

    templateHelpers: function() {},

    events: {
        'submit': 'sendAppointment'
    },

    behaviors: function() {
        return {
            GoogleMap: {
                showPlaces: true,
                mapCanvas: '#map-canvas',
                mapOptions: {
                    zoom: 15,
                    center: [34.096118, -118.124171]
                }
            }
        };
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
        
        this.collection.fetch();
        
        function nonWorkingDates(date){
            var day = date.getDay(), Sunday = 0, Monday = 1, Tuesday = 2, Wednesday = 3, Thursday = 4, Friday = 5, Saturday = 6;
            var closedDates = [];
            var closedDays = [[Sunday], [Monday]];
            for (var i = 0; i < closedDays.length; i++) {
                if (day == closedDays[i][0]) {
                    return [false];
                }
            }

            for (i = 0; i < closedDates.length; i++) {
                if (date.getMonth() == closedDates[i][0] - 1 &&
                date.getDate() == closedDates[i][1] &&
                date.getFullYear() == closedDates[i][2]) {
                    return [false];
                }
            }

            return [true];
        }

        this.ui.formDate.datepicker({ minDate: 0, maxDate: '', beforeShowDay: nonWorkingDates});

        this.ui.formDate.change(_.bind(function() {
            this.ui.formTime.html('');
            this.collection.searchByDate(this.ui.formDate.val());
            this.displayTimes();
        }, this));

    },

    displayTimes: function () {
        this.takenTimes = [];
        this.availableTimes = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];

        _.each(this.collection.models, _.bind(function(model) {
            this.takenTimes.push(model.get('time'));
        }, this));

        this.availableTimes = _.difference(this.availableTimes, this.takenTimes);

        _.each(this.availableTimes, _.bind(function(time) {
            var timeN = parseInt(time);
            if (timeN > 12) {
                timeN = timeN - 12;
            }

            this.ui.formTime
                .append($('<option></option>')
                .attr('value', timeN)
                .text(timeN + ':00' + (timeN < 12 && timeN > 9 ? 'am' : 'pm')));
        }, this));

    },

    sendAppointment: function (e) {
        e.preventDefault();

        var appointment = new Appointment();
        var formTitle = this.ui.formTitle.val(),
            formDate = this.ui.formDate.val(),
            formTime = this.ui.formTime.val(),
            formService = this.ui.formService.val(),
            formEmail = this.ui.formEmail.val(),
            formPhone = this.ui.formPhone.val(),
            formRequests = this.ui.formRequests.val();

        var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        if (formEmail === '' || !regex.test(formEmail)) {
            this.ui.submitMessage.css('background-color', "#ffa3a3");
            this.ui.submitMessage.text('Please enter a valid email address.');
            this.ui.submitMessage.fadeIn(200);
        } else {
            appointment.save({
                title: formTitle,
                date: formDate,
                time: formTime,
                service: formService,
                email: formEmail,
                phone: formPhone,
                request: formRequests
            });

            app.appRouter.navigate(constants.USER_ID + '/success', { trigger: true });
        }
    },

    onBeforeDestroy: function () {},

    onDestroy: function () {}

});
