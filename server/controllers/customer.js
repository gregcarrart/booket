var Customer     = require('../models/customer'),
    mongoose = require('mongoose'),
    hbs = require('hbs'),
    path = require('path'),
    config = require('config'),
    multiparty = require('multiparty'),
    extend = require('util')._extend;

exports.load = function(req, res, next, id) {
    Customer.load(id, function(err, customer) {
        if (err) return next(err);
        if (!customer) return next(new Error('not found'));
        req.customer = customer;
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

    Customer.list(options, function(err, customer) {
        if (err) return next(err);
        if (!user) return next(new Error('not found'));
        req.customer = customer;
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

    Customer.list(options, function(err, customers) {
        if (err) return res.render('500');
        Customer.count().exec(function(err, count) {
            return res.render('admin/customers/index', {
                layout: 'default-admin',
                title: 'Users',
                customers: customers,
                page: page + 1,
                pages: Math.ceil(count / perPage),
                message: req.flash('success'),
                error:req.flash('error')
            });
        });
    });
};

exports.new = function(req, res) {
    return res.render('admin/customers/new', {
        layout: 'default-admin',
        title: 'New User',
        customer: new Customer({}),
        message: req.flash('success'),
        error:req.flash('error')
    });
};

exports.create = function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        var customer = new Customer(fields);

        customer.uploadAndUpdate(files, function(err) {
            if (!err) {
                req.flash('success', 'Information updated');
            } else {
                req.flash('error', 'There was an error');
            }

            return res.redirect('/admin/customers/' + customer._id);
        });
    });
};

exports.destroy = function(req, res) {
    var customer = req.customer;
    customer.remove(function(err) {
        req.flash('success', 'Information updated');
        res.redirect('/admin/customers');
    });
};

exports.edit = function(req, res) {
    return res.render('admin/customers/edit', {
        layout: 'default-admin',
        title: 'Edit Customer',
        customer: req.customer,
        message: req.flash('success'),
        error:req.flash('error')
    });
};

exports.update = function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {

        var customer = req.customer;
        customer = extend(customer, fields);

        customer.uploadAndUpdate(files, function(err) {
            if (!err) {
                req.flash('success', 'Information updated');
            } else {
                req.flash('error', 'There was an error');
            }

            return res.redirect('/admin/customers/');
        });
    });
};

exports.all = function(req, res) {
    Customer.find({}, function(err, customers) {
        return res.send(customers);
    });
}

