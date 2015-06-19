var Calendar     = require('../models/calendar'),
    mongoose = require('mongoose'),
    hbs = require('hbs'),
    path = require('path'),
    config = require('config'),
    multiparty = require('multiparty'),
    gcal = require('google-calendar'),
    extend = require('util')._extend;

exports.load = function(req, res, next, id) {
    Calendar.load(id, function(err, calendar) {
        if (err) return next(err);
        if (!calendar) return next(new Error('not found'));
        req.calendar = calendar;
        next();
    });
};

exports.loadBySlug = function(req, res, next, id) {
    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
    var perPage = 30;
    var options = {
        perPage: perPage,
        page: page,
        criteria: {slug: req.param('calendarSlug')}
    };

    Calendar.list(options, function(err, calendar) {
        if (err) return next(err);
        if (!calendar) return next(new Error('not found'));
        req.calendar = calendar;
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

    Calendar.list(options, function(err, calendar) {
        if (err) return res.render('500');
        Calendar.count().exec(function(err, count) {
            return res.render('admin/calendar-item/index', {
                user: req.user,
                layout: 'default-admin',
                title: 'Appointments',
                calendar: calendar,
                page: page + 1,
                pages: Math.ceil(count / perPage),
                message: req.flash('success'),
                error:req.flash('error')
            });
        });
    });
};

exports.new = function(req, res) {
    return res.render('admin/calendar-item/new', {
        layout: 'default-admin',
        title: 'Create New Appointment',
        calendar: new Calendar({}),
        message: req.flash('success'),
        error:req.flash('error')
    });
};

exports.create = function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        var calendar = new Calendar(fields);
        var accessToken = req.session.access_token;
        var calendarId = 'en0l2o77far1l26216o1hitk9c@group.calendar.google.com';
        var text = fields || 'Test';

        calendar.uploadAndUpdate(files, function(err) {
            if (!err) {
                req.flash('success', 'Information updated');
            } else {
                req.flash('error', 'There was an error');
            }

           
            /*gcal(accessToken).events.quickAdd(calendarId, text, function(err, data) {
                if(err) return res.send(500,err);
                
            });*/
            return res.redirect('/admin/calendar-item/');
        });
    });
};

exports.destroy = function(req, res) {
    var calendar = req.calendar;
    calendar.remove(function(err) {
        req.flash('success', 'Information updated');
        res.redirect('/admin/calendar-item');
    });
};

exports.edit = function(req, res) {
    return res.render('admin/calendar-item/edit', {
        layout: 'default-admin',
        title: 'Edit Appointment',
        calendar: req.calendar,
        message: req.flash('success'),
        error:req.flash('error')
    });
};

exports.update = function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {

        var calendar = req.calendar;
        calendar = extend(calendar, fields);

        calendar.uploadAndUpdate(files, function(err) {
            if (!err) {
                req.flash('success', 'Information updated');
            } else {
                req.flash('error', 'There was an error');
            }

            return res.redirect('/admin/calendar-item/' + calendar._id);
        });
    });

};

exports.all = function(req, res) {
    Calendar.find({}, function(err, calendar) {
        return res.send(calendar);
    });
}

