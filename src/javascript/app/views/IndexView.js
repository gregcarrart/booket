var BaseLayoutView = require('./BaseLayoutView'),
    app = require('app/app'),
    template = require('templates/index.hbs'),
    channels = require('channels'),
    constants = require('utils/constants'),
    helpers = require('../utils/helpers'),
    moment = require('moment'),
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
                },
                userAddress: this.options.user.models[0].get('address')
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
        

        this.ui.formDate.datepicker({ 
                minDate: 0, 
                maxDate: '', 
                beforeShowDay: _.bind(function(date){
                    var momentDay = moment(date).format('dddd');
                    var closedDates = [];
                    var closedDays = this.options.user.models[0].get('closed');

                    for (var i = 0; i < closedDays.length; i++) {
                        if (momentDay.toLowerCase() == closedDays[i]) {
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
            this.displayTimes(this.ui.formDate.val());
        }, this));

    },

    displayTimes: function (date) {
        this.takenTimes = [];
        this.availableTimes = [];
        this.hours = [];
        
        var newDate = new Date(date);
        var appointmentIncrement = this.options.user.models[0].get('appointmentIncrement');
        var convertedIncrement = convertIncrement(appointmentIncrement);
        var selectedDay = moment(newDate).format('dddd').toLowerCase();
        var openTime = this.options.user.models[0].get('hours')[0][selectedDay].open;
        var closeTime = this.options.user.models[0].get('hours')[0][selectedDay].close;
        var totalAvailableHours = Math.round(((closeTime - openTime)/100) / (convertedIncrement));

        function convertIncrement(increment) {
            var hour = parseInt(increment.length > 3 ? increment.substring(0,2) : increment.substring(0,1));
            var minute = parseInt(increment.slice(-2)) / 60;
            return hour + minute;
        }

        function translateHour(hour) {
            var hour = hour.toString();
            var hourSub = hour.length > 3 ? hour.substring(0,2) : hour.substring(0,1);
            var minutesSliced = hour.slice(-2);
            var hourNum = parseInt(hourSub);
            if (hourNum > 12) {
                hourNum = hourNum - 12;
            }
            return hourNum.toString();
        }

        function getMinutes(hour) {
            var hour = hour.toString();
            var minutes = hour.slice(-2);

            return minutes;
        }

        function checkAmPm(hour) {
            var hour = hour.toString();
            var hourSub = hour.length > 3 ? hour.substring(0,2) : hour.substring(0,1);
            var minutesSliced = hour.slice(-2);
            var hourNum = parseInt(hourSub);
            if (hourNum >= 12) {
                return 'pm';
            } else {
                return 'am';
            }
        }

        function incrementHelper(openTime, time, index) {
            var minutes = time.slice(-2);
            var minutesInc = minutes * index;
            var hour = time.length > 3 ? time.substring(0,2) : time.substring(0,1);
            var hourInc = hour * index;
            var startingHour = openTime.length > 3 ? openTime.substring(0,2) : openTime.substring(0,1);
            var startingMinutes = openTime.slice(-2);
            var momentObj = moment().set({'hour': startingHour, 'minutes': startingMinutes});
            var increment = momentObj.add({minutes:minutesInc, hours:hourInc});
            var newHour = increment.get('hour').toString();
            var newMin = increment.get('minutes').toString();

            if (newMin === '0') {
                return newHour + newMin + '0';
            } else if (newMin.length < 2) {
                return newHour + '0' + newMin;
            } else {
                return newHour + newMin;
            }
        }

        for (var i=0; i < totalAvailableHours; i++) {
            var increment = incrementHelper(openTime, appointmentIncrement, i);
            this.hours.push(increment);
            this.availableTimes.push(translateHour(increment) + ':' + getMinutes(increment) + checkAmPm(increment));
        }

        _.each(this.collection.models, _.bind(function(model) {
            var takenTime = (model.get('time') > 12 ? model.get('time') - 12 : model.get('time')) + (model.get('time').length < 3 ? ':00' : '') + (model.get('time') >= 12 ? 'pm' : 'am');
            this.takenTimes.push(takenTime);
        }, this));
        
        this.availableTimes = _.difference(this.availableTimes, this.takenTimes);

        _.each(this.availableTimes, _.bind(function(time) {
            var timeSplit = time.split(/:|am|pm/).join('');
            var hourSub = timeSplit.length > 3 ? timeSplit.substring(0,2) : timeSplit.substring(0,1); 
            var minutesSliced = timeSplit.slice(-2);
            var hourNum = parseInt(hourSub);
            if (hourSub > 12) {
                hourSub = hourSub - 12;
            }

            if (time.includes('pm') && time !== '12:00pm') {
                var timeValue = time.split(/:|am|pm/).join('');
                var timeValue = timeValue.length > 3 ? timeValue.substring(0,2) : timeValue.substring(0,1); 
                var formattedTime = parseInt(timeValue) + 12;
            } else {
                var timeValue = time.split(/:|am|pm/).join('');
                var formattedTime = parseInt(timeValue.length > 3 ? timeValue.substring(0,2) : timeValue.substring(0,1));
            }

            this.ui.formTime
                .append($('<option></option>')
                .attr('value', formattedTime)
                .text(time));
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
