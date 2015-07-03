var Calendar     = require('../models/calendar'),
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
    var perPage = 7;
    var options = {
        perPage: perPage,
        page: page
    };

    Calendar.find({user: req.user.id}, function(err, calendar) {
        if (err) return res.render('500');
        var date = new Date(calendar.date);
        var momentDate = moment(date).format('l');

        Calendar.count().exec(function(err, count) {
            return res.render('admin/bookings/index', {
                user: req.user,
                layout: 'default-admin',
                title: 'Bookings',
                calendar: calendar,
                page: page + 1,
                pages: Math.ceil(count / perPage),
                message: req.flash('success'),
                error:req.flash('error')
            });
        });
    });
};

