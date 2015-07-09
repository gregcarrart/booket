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
            services = fields.services.toString().split(','),
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

        user.update(
            {settings: {
                appointmentIncrement: fields.appointmentIncrementHours + fields.appointmentIncrementMinutes,
                businessName: fields.name,
                address: fields.address,
                phone: fields.phone,
                hours: {
                    monday: {
                        open: checkAmPm(mondayOpen, fields.mondayOpen, fields.mondayOpenAmPm) + fields.mondayOpenMinutes,
                        close: checkAmPm(mondayClose, fields.mondayClose, fields.mondayCloseAmPm) + fields.mondayCloseMinutes
                    },
                    tuesday: {
                        open: checkAmPm(tuesdayOpen, fields.tuesdayOpen, fields.tuesdayOpenAmPm) + fields.tuesdayOpenMinutes,
                        close: checkAmPm(tuesdayClose, fields.tuesdayClose, fields.tuesdayCloseAmPm) + fields.tuesdayCloseMinutes
                    },
                    wednesday: {
                        open: checkAmPm(wednesdayOpen, fields.wednesdayOpen, fields.wednesdayOpenAmPm) + fields.wednesdayOpenMinutes,
                        close: checkAmPm(wednesdayClose, fields.wednesdayClose, fields.wednesdayCloseAmPm) + fields.wednesdayCloseMinutes
                    },
                    thursday: {
                        open: checkAmPm(thursdayOpen, fields.thursdayOpen, fields.thursdayOpenAmPm) + fields.thursdayOpenMinutes,
                        close: checkAmPm(thursdayClose, fields.thursdayClose, fields.thursdayCloseAmPm) + fields.thursdayCloseMinutes
                    },
                    friday: {
                        open: checkAmPm(fridayOpen, fields.fridayOpen, fields.fridayOpenAmPm) + fields.fridayOpenMinutes,
                        close: checkAmPm(fridayClose, fields.fridayClose, fields.fridayCloseAmPm) + fields.fridayCloseMinutes
                    },
                    saturday: {
                        open: checkAmPm(saturdayOpen, fields.saturdayOpen, fields.saturdayOpenAmPm) + fields.saturdayOpenMinutes,
                        close: checkAmPm(saturdayClose, fields.saturdayClose, fields.saturdayCloseAmPm) + fields.saturdayCloseMinutes
                    },
                    sunday: {
                        open: checkAmPm(sundayOpen, fields.sundayOpen, fields.sundayOpenAmPm) + fields.sundayOpenMinutes,
                        close: checkAmPm(sundayClose, fields.sundayClose, fields.sundayCloseAmPm) + fields.sundayCloseMinutes
                    }
                },
                closed: closedArray,
                services: services,
                showServices: showServices,
                showPhone: showPhone,
                showRequests: showRequests,
                showMap: showMap,
                user: req.user.id

            }}, function() {
                return res.redirect('/admin/settings');
            }
        );

        /*user.save(function() {
            return res.redirect('/admin/settings');
        });*/
        
    });
};

