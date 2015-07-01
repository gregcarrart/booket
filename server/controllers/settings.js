var User     = require('../models/user'),
    mongoose = require('mongoose'),
    hbs = require('hbs'),
    path = require('path'),
    config = require('config'),
    multiparty = require('multiparty'),
    extend = require('util')._extend;

exports.index = function(req, res){
    return res.render('admin/settings/index', {
        layout: 'default-admin',
        title: 'Settings',
        user: req.user,
        message: req.flash('success'),
        error:req.flash('error')
    });
};

exports.update = function(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        console.log(fields);

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

        var closedArray = [];

        if (fields.closedMonday) {
            closedArray.push('monday');
        }
        
        var user = req.user;

        user.settings.businessName = fields.name;
        user.settings.address = fields.address;
        user.settings.phone = fields.phone;
        user.settings.hours.monday.open = fields.mondayOpen;
        user.settings.hours.monday.close = fields.mondayClose;
        user.settings.closed = closedArray;
        user.settings.services = fields.services;
        user.settings.showServices = fields.showServices;
        user.settings.showPhone = fields.showPhone;
        user.settings.showRequests = fields.showRequests;
        user.settings.showMap = fields.showMap;

        user.save(function() {
            return res.redirect('admin/settings/index');
        });
        
    });
};

exports.all = function(req, res) {
    Settings.find({}, function(err, user) {
        return res.send(user);
    });
}

