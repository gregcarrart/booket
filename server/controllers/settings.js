var User     = require('../models/user'),
    mongoose = require('mongoose'),
    hbs = require('hbs'),
    path = require('path'),
    config = require('config'),
    multiparty = require('multiparty'),
    extend = require('util')._extend;

exports.index = function(req, res){
    console.log(req.user.settings.hours[0].wednesday);
    return res.render('admin/settings/index', {
        layout: 'default-admin',
        title: 'Settings',
        user: req.user,
        hours: req.user.settings.hours[0],
        message: req.flash('success'),
        error:req.flash('error')
    });
};

exports.update = function(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        var mondayOpen = '',
            mondayClose = '',
            tuesdayOpen = '',
            tuesdayClose = '',
            wednesdayOpen = '',
            wednesdayClose = '',
            thursdayOpen = '',
            thursdayClose = '',
            fridayOpen = '',
            fridayClose = '',
            saturdayOpen = '',
            saturdayClose = '',
            sundayOpen = '',
            sundayClose = '',
            showServices = false, 
            showPhone = false, 
            showRequests = false, 
            showMap = false,
            closedArray = [],
            user = req.user;

        typeof fields.showServices !== 'undefined' ? showServices = true : showServices = false;
        typeof fields.showPhone !== 'undefined' ? showPhone = true : showPhone = false;
        typeof fields.showRequests !== 'undefined' ? showRequests = true : showRequests = false;
        typeof fields.showMap !== 'undefined' ? showMap = true : showMap = false;

        if (typeof fields.closedMonday !== 'undefined') closedArray.push('monday');
        if (typeof fields.closedTuesday !== 'undefined') closedArray.push('tuesday');
        if (typeof fields.closedWednesday !== 'undefined') closedArray.push('wednesday');
        if (typeof fields.closedThursday !== 'undefined') closedArray.push('thursday');
        if (typeof fields.closedFriday !== 'undefined') closedArray.push('friday');
        if (typeof fields.closedSaturday !== 'undefined') closedArray.push('saturday');
        if (typeof fields.closedSunday !== 'undefined') closedArray.push('sunday');
        
        function checkAmPm(dayVar, fieldDay, openClose) {
            if (openClose.toString() === 'am') {
                dayVar = fieldDay.toString().replace(/\:/g, '');
            } else {
                dayVar = fieldDay.toString().replace(/\:/g, '');
                dayVar = parseInt(dayVar);
                dayVar = dayVar + 12;
                dayVar.toString();
            }
            return dayVar;
        }

        user.settings.businessName = fields.name;
        user.settings.address = fields.address;
        user.settings.phone = fields.phone;
        user.settings.hours[0].monday.open = checkAmPm(mondayOpen, fields.mondayOpen, fields.mondayOpenAmPm) + fields.mondayOpenMinutes;
        user.settings.hours[0].monday.close = checkAmPm(mondayClose, fields.mondayClose, fields.mondayCloseAmPm) + fields.mondayCloseMinutes;
        user.settings.hours[0].tuesday.open = checkAmPm(tuesdayOpen, fields.tuesdayOpen, fields.tuesdayOpenAmPm) + fields.tuesdayOpenMinutes;
        user.settings.hours[0].tuesday.close = checkAmPm(tuesdayClose, fields.tuesdayClose, fields.tuesdayCloseAmPm) + fields.tuesdayCloseMinutes;
        user.settings.hours[0].wednesday.open = checkAmPm(wednesdayOpen, fields.wednesdayOpen, fields.wednesdayOpenAmPm) + fields.wednesdayOpenMinutes;
        user.settings.hours[0].wednesday.close = checkAmPm(wednesdayClose, fields.wednesdayClose, fields.wednesdayCloseAmPm) + fields.wednesdayCloseMinutes;
        user.settings.hours[0].thursday.open = checkAmPm(thursdayOpen, fields.thursdayOpen, fields.thursdayOpenAmPm) + fields.thursdayOpenMinutes;
        user.settings.hours[0].thursday.close = checkAmPm(thursdayClose, fields.thursdayClose, fields.thursdayCloseAmPm) + fields.thursdayCloseMinutes;
        user.settings.hours[0].friday.open = checkAmPm(fridayOpen, fields.fridayOpen, fields.fridayOpenAmPm) + fields.fridayOpenMinutes;
        user.settings.hours[0].friday.close = checkAmPm(fridayClose, fields.fridayClose, fields.fridayCloseAmPm) + fields.fridayCloseMinutes;
        user.settings.hours[0].saturday.open = checkAmPm(saturdayOpen, fields.saturdayOpen, fields.saturdayOpenAmPm) + fields.saturdayOpenMinutes;
        user.settings.hours[0].saturday.close = checkAmPm(saturdayClose, fields.saturdayClose, fields.saturdayCloseAmPm) + fields.saturdayCloseMinutes;
        user.settings.hours[0].sunday.open = checkAmPm(sundayOpen, fields.sundayOpen, fields.sundayOpenAmPm) + fields.sundayOpenMinutes;
        user.settings.hours[0].sunday.close = checkAmPm(sundayClose, fields.sundayClose, fields.sundayCloseAmPm) + fields.sundayCloseMinutes;
        user.settings.closed = closedArray;
        user.settings.services = fields.services;
        user.settings.showServices = showServices;
        user.settings.showPhone = showPhone;
        user.settings.showRequests = showRequests;
        user.settings.showMap = showMap;

        user.save(function() {
            return res.redirect('/admin/settings');
        });
        
    });
};

exports.all = function(req, res) {
    Settings.find({}, function(err, user) {
        return res.send(user);
    });
}

