var mongoose = require('mongoose'),
    hbs = require('hbs'),
    path = require('path'),
    config = require('config'),
    multiparty = require('multiparty'),
    extend = require('util')._extend;

exports.index = function(req, res){
    //if(!req.session.access_token) return res.redirect('/google-auth');

    res.render('admin/account/index', {
        user: req.user,
        layout: 'default-admin',
        title: 'Users',
        user: req.user,
        message: req.flash('success'),
        error:req.flash('error')
    });
};

