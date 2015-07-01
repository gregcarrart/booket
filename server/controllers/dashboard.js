var Calendar     = require('../models/calendar'),
    Review = require('../models/review'),
    mongoose = require('mongoose'),
    hbs = require('hbs'),
    path = require('path'),
    config = require('config'),
    moment = require('moment'),
    multiparty = require('multiparty'),
    extend = require('util')._extend;

exports.index = function(req, res){
    //if(!req.session.access_token) return res.redirect('/google-auth');

    var today = new Date();
    var momentDate = moment(today);
    var appointmentCounter = 0;

    Calendar.find({user: req.user.slug}, function(err, calendar) {
        if (err) return res.render('500');

        for (var i=0; i < calendar.length; i++) {
            var calendarDate = new Date(calendar[i].date);

            if (momentDate.isSame(calendarDate, 'd')) {
                appointmentCounter++;
            }
        }

        Calendar.count().exec(function(err, count) {
            return res.render('admin/dashboard/index', {
                user: req.user,
                layout: 'default-admin',
                title: 'Settings',
                calendar: calendar,
                appointmentCounter: appointmentCounter,
                message: req.flash('success'),
                error:req.flash('error')
            });
        });
    });
};

