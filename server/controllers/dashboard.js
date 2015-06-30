var Calendar     = require('../models/calendar'),
    Review = require('../models/review'),
    mongoose = require('mongoose'),
    hbs = require('hbs'),
    path = require('path'),
    config = require('config'),
    moment = require('moment'),
    multiparty = require('multiparty'),
    extend = require('util')._extend;

exports.load = function(req, res, next, id) {
    Calendar.load(id, function(err, calendar) {
        if (err) return next(err);
        if (!calendar) return next(new Error('not found'));
        req.calenar = calendar;
        next();
    });
};

exports.index = function(req, res){
    //if(!req.session.access_token) return res.redirect('/google-auth');

    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
    var perPage = 300;
    var options = {
        perPage: perPage,
        page: page
    };
    var today = new Date();
    var momentDate = moment(today);
    var appointmentCounter = 0;

    Calendar.list(options, function(err, calendar) {
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
                user: req.user,
                appointmentCounter: appointmentCounter,
                page: page + 1,
                pages: Math.ceil(count / perPage),
                message: req.flash('success'),
                error:req.flash('error')
            });
        });
    });
};

