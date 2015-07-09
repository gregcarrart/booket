var User     = require('../models/user'),
    mongoose = require('mongoose'),
    hbs = require('hbs'),
    path = require('path'),
    config = require('config'),
    multiparty = require('multiparty'),
    extend = require('util')._extend;

exports.load = function(req, res, next, id) {
    User.load(id, function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('not found'));
        req.user = user;
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

    User.list(options, function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('not found'));
        req.user = user;
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

    User.list(options, function(err, users) {
        if (err) return res.render('500');
        User.count().exec(function(err, count) {
            return res.render('admin/users/index', {
                user: req.user,
                layout: 'default-admin',
                title: 'Users',
                users: users,
                page: page + 1,
                pages: Math.ceil(count / perPage),
                message: req.flash('success'),
                error:req.flash('error')
            });
        });
    });
};

exports.new = function(req, res) {
    return res.render('admin/users/new', {
        layout: 'default-admin',
        title: 'New User',
        user: new User({}),
        message: req.flash('success'),
        error:req.flash('error')
    });
};

exports.create = function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        var user = new User(fields);

        user.uploadAndUpdate(files, function(err) {
            if (!err) {
                req.flash('success', 'Information updated');
            } else {
                req.flash('error', 'There was an error');
            }

            return res.redirect('/admin/users/' + user._id);
        });
    });
};

exports.destroy = function(req, res) {
    User.findById(req.params.userId).remove(function(err) {
        req.flash('success', 'Information updated');
        return res.redirect('/admin/users');
    });
};

exports.edit = function(req, res) {
    User.findById(req.params.userId, function(err, user) {
        return res.render('admin/users/edit', {
            layout: 'default-admin',
            title: 'Edit User Details',
            user: user,
            message: req.flash('success'),
            error:req.flash('error')
        });
    });
};

exports.update = function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {

        User.findById(req.params.userId, function(err, user) {
            user = extend(user, fields);

            user.uploadAndUpdate(files, function(err) {
                if (!err) {
                    req.flash('success', 'Information updated');
                } else {
                    req.flash('error', 'There was an error');
                }

                return res.redirect('/admin/users');
            });
        });
    });
};

exports.all = function(req, res) {
    User.findById(req.params.userId, function(err, user) {
        return res.send(user.settings);
    });
};

