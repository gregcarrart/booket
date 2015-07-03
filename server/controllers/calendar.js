var Calendar     = require('../models/calendar'),
    mongoose = require('mongoose'),
    hbs = require('hbs'),
    path = require('path'),
    config = require('config'),
    multiparty = require('multiparty'),
    gcal = require('google-calendar'),
    nodemailer = require('nodemailer'),
    extend = require('util')._extend,
    moment = require('moment'),
    transporter;

//Detect NODE_ENV
switch(config.util.getEnv('NODE_ENV')){
    case 'dev':
        var configDB = config.get('Dev');

        transporter = nodemailer.createTransport({
            service: configDB.emailClient,
            auth: {
                user: configDB.emailUser,
                pass: configDB.emailPass
            }
        });

        var destinationEmail = configDB.emailUser;
        var clientName = configDB.clientName;
         
        break;

    case 'production':
        transporter = nodemailer.createTransport({
            service: process.env.EMAIL_CLIENT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        var destinationEmail = process.env.EMAIL_USER;
        var clientName = process.env.CLIENT_NAME;
        
        break;

    default:
        console.log('env error');
}

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

    Calendar.list({}, function(err, calendar) {
        if (err) return res.render('500');
        return res.render('admin/calendar-item/index', {
            user: req.user,
            layout: 'default-admin',
            title: 'Appointments',
            calendar: calendar,
            userName: req.user.name.toLowerCase(),
            message: req.flash('success'),
            error:req.flash('error')
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

exports.clientCreate = function(req, res) {
    var calendar = new Calendar({
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        service: req.body.service,
        email: req.body.email,
        phone: req.body.phone,
        request: req.body.request,
        user: req.params.userSlug
    });

    var dateToDate = new Date(req.body.date);
    var momentDate = moment(dateToDate).format("MMM Do YYYY");
    var timeN = parseInt(req.body.time);
    var phoneString = req.body.phone;
    var phoneNumber = '(' + phoneString.slice(0, 3) + ') ' + phoneString.slice(3, 6) + '-' + phoneString.slice(6);
   
    if (timeN > 12) {
        timeN = timeN - 12;
    }

    var formatTime = (timeN + ':00' + (timeN < 12 && timeN > 9 ? 'am' : 'pm'));


    calendar.uploadAndUpdate(null, function(err) {
        if (!err) {
            req.flash('success', 'Information updated');
        } else {
            req.flash('error', 'There was an error');
        }

        var emailVal = req.body.email;
        var nameVal = req.body.date;
        var messageValToAdmin = 'Hello,<br><br>I would like to set an appointment for ' + momentDate + ' at ' + formatTime + '. My phone number is ' + phoneNumber +'.<br><br>Thank you,<br>' + req.body.title;
        var messageValToUser = 'Hello,<br><br>Thank you for setting an appointment on ' + momentDate + ' at ' + formatTime + '. Please reply to this email if anything changes or you cannot make your appointment. Look forward to seeing you!<br><br>Thank you,<br>' + clientName;

        var mailOptionsToAdmin= {
            from: emailVal, // sender address
            to: destinationEmail, // list of receivers. This is whoever you want to get the email when someone hits submit
            subject: 'New Appointment for ' + momentDate + ' - booket scheduling app', // Subject line
            html: messageValToAdmin // plaintext body
        };

        var mailOptionsToUser = {
            from: destinationEmail, // sender address
            to: emailVal, // list of receivers. This is whoever you want to get the email when someone hits submit
            subject: 'Thank you! Your appointment is confirmed with ' + clientName + ' - booket scheduling app', // Subject line
            html: messageValToUser // plaintext body
        }

        // send mail with defined transport object
        transporter.sendMail(mailOptionsToAdmin, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });

        // send mail with defined transport object
        transporter.sendMail(mailOptionsToUser, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
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
    var calendarDate = new Date(req.calendar.date);
    var momentDate = moment(calendarDate).format('l');

    console.log(req.user.settings.services);
    return res.render('admin/calendar-item/edit', {
        layout: 'default-admin',
        title: 'Edit Appointment',
        calendar: req.calendar,
        services: req.user.settings.services,
        date: momentDate,
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

            return res.redirect('/admin/bookings/');
        });
    });

};

exports.all = function(req, res) {
    Calendar.find({user: req.params.userSlug}, function(err, calendar) {
        return res.send(calendar);
    });
}

