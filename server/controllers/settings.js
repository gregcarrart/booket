var Settings     = require('../models/settings'),
    mongoose = require('mongoose'),
    hbs = require('hbs'),
    path = require('path'),
    config = require('config'),
    multiparty = require('multiparty'),
    extend = require('util')._extend;

exports.load = function(req, res, next, id) {
    Settings.load(id, function(err, settings) {
        if (err) return next(err);
        if (!settings) return next(new Error('not found'));
        req.settings = settings;
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

    Settings.list(options, function(err, settings) {
        if (err) return res.render('500');

        Settings.count().exec(function(err, count) {
            return res.render('admin/settings/index', {
                user: req.user,
                layout: 'default-admin',
                title: 'Settings',
                settings: settings[0],
                page: page + 1,
                pages: Math.ceil(count / perPage),
                message: req.flash('success'),
                error:req.flash('error')
            });
        });
    });
};

exports.update = function(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        if (fields.showServices) {
            fields.showServices.toString() === 'on' ? true : false;
        }
        if (fields.showPhone) {
            fields.showPhone.toString() === 'on' ? true : false;
        }
        if (fields.showRequests) {
            fields.showRequests.toString() === 'on' ? true : false;
        }
        if (fields.showMap) {
            fields.showMap.toString() === 'on' ? true : false;
        }
        var settings = req.settings;
        settings.extend(settings, fields);
        
        settings.uploadAndUpdate(files, function(err) {
            if (!err) {
                req.flash('success', 'Information updated');
            } else {
                req.flash('error', 'There was an error');
            }

            return res.redirect('/admin/settings');
        });
        
    });
};

exports.all = function(req, res) {
    Settings.find({}, function(err, user) {
        return res.send(user);
    });
}

