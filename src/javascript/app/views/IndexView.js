var BaseLayoutView = require('./BaseLayoutView'),
    app = require('app/app'),
    template = require('templates/index.hbs'),
    channels = require('channels'),
    constants = require('utils/constants'),
    paper = require('libs/paper-full.min'),
    helpers = require('../utils/helpers'),
    Appointment = require('../models/Appointment'),
    User = require('../models/User'),
    Velocity = require('velocity-animate');

require('jquery-ui');
require('behaviors/GoogleMap');

app.registerPreloader('home', {
    collections: ['user', 'calendars']
}, function (user) {
    return user.pluck('headerImage');
});

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

    templateHelpers: function() {
        var user = this.options.user.models[0];
        var phoneNum = '(' + user.get('phone').slice(0,3) + ') ' + user.get('phone').slice(3,6) + '-' + user.get('phone').slice(6);
        var mondayOpen = formatTime(user.get('hours')[0].monday.open),
            mondayClose = formatTime(user.get('hours')[0].monday.close),
            tuesdayOpen = formatTime(user.get('hours')[0].tuesday.open),
            tuesdayClose = formatTime(user.get('hours')[0].tuesday.close),
            wednesdayOpen = formatTime(user.get('hours')[0].wednesday.open),
            wednesdayClose = formatTime(user.get('hours')[0].wednesday.close),
            thursdayOpen = formatTime(user.get('hours')[0].thursday.open),
            thursdayClose = formatTime(user.get('hours')[0].thursday.close),
            fridayOpen = formatTime(user.get('hours')[0].friday.open),
            fridayClose = formatTime(user.get('hours')[0].friday.close),
            saturdayOpen = formatTime(user.get('hours')[0].saturday.open),
            saturdayClose = formatTime(user.get('hours')[0].saturday.close),
            sundayOpen = formatTime(user.get('hours')[0].sunday.open),
            sundayClose = formatTime(user.get('hours')[0].sunday.close);

        function formatTime(time) {
            var hourSub = time.length > 3 ? time.substring(0,2) : time.substring(0,1);
            var minutesSliced = time.slice(-2);
            var hourNum = parseInt(hourSub);
            if (hourNum > 12) {
                hourNum = hourNum - 12;
                hourNum = hourNum.toString() + ':' + minutesSliced + ' pm';
            } else if (hourNum === 12) {
                hourNum = hourNum.toString() + ':' + minutesSliced + ' pm';
            } else {
                hourNum = hourNum.toString() + ':' + minutesSliced + ' am';
            }

            return hourNum.toString();
        }

        function checkClosed(day) {
            var tempArray = [];
            for (i = 0; i < user.get('closed').length; i++) {
                if (user.get('closed')[i].indexOf(day) > -1) {
                    tempArray.push(day);
                }
            }
            
            if (tempArray.length > 0) {
                return true;
            } else {
                return false;
            }
        }

        return {
            businessName: user.get('businessName'),
            address: user.get('address'),
            phone: user.get('phone'),
            phoneFormat: phoneNum,
            hoursMondayOpen: mondayOpen,
            hoursMondayClose: mondayClose,
            hoursTuesdayOpen: tuesdayOpen,
            hoursTuesdayClose: tuesdayClose,
            hoursWednesdayOpen: wednesdayOpen,
            hoursWednesdayClose: wednesdayClose,
            hoursThursdayOpen: thursdayOpen,
            hoursThursdayClose: thursdayClose,
            hoursFridayOpen: fridayOpen,
            hoursFridayClose: fridayClose,
            hoursSaturdayOpen: saturdayOpen,
            hoursSaturdayClose: saturdayClose,
            hoursSundayOpen: sundayOpen,
            hoursSundayClose: sundayClose,
            mondayIsClosed: checkClosed('monday'),
            tuesdayIsClosed: checkClosed('tuesday'),
            wednesdayIsClosed: checkClosed('wednesday'),
            thursdayIsClosed: checkClosed('thursday'),
            fridayIsClosed: checkClosed('friday'),
            saturdayisClosed: checkClosed('saturday'),
            sundayisClosed: checkClosed('sunday'),
            services: user.get('services'),
            showServices: user.get('showServices'),
            showRequests: user.get('showRequests'),
            showPhone: user.get('showPhone'),
            showMap: user.get('showMap'),
            showHeaderImage: ('showHeaderImage'),
            showLogo: ('showLogo')
        }
    },

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

    initialize: function () {
       //console.log(this.options.user.models[0].get('address'));
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
        
        this.collection.fetch();
        
        function nonWorkingDates(date){
            console.log(date);
            
        }

        this.ui.formDate.datepicker({ 
                minDate: 0, 
                maxDate: '', 
                beforeShowDay: _.bind(function(date){
                    var day = date.getDay(), sunday = 0, monday = 1, tuesday = 2, wednesday = 3, thursday = 4, friday = 5, saturday = 6;
                    var closedDates = [];
                    var closedDays = [this.options.user.models[0].get('closed')];

                    for (var i = 0; i < closedDays.length; i++) {
                        if (day == closedDays[i]) {
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
                },this)
            });

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
