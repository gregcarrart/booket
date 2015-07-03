var mongoose = require('mongoose'),
    hbs = require('hbs'),
    path = require('path'),
    config = require('config'),
    multiparty = require('multiparty'),
    extend = require('util')._extend;

exports.index = function(req, res){
    res.render('admin/account/index', {
        user: req.user,
        layout: 'default-admin',
        title: 'Users',
        user: req.user,
        message: req.flash('success'),
        error:req.flash('error')
    });
};

exports.update = function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {

        var user = req.user;

        if (fields.password.toString() !== '' && fields.passwordCheck.toString() !== '') {
            user.name = fields.name;
            user.local.email = fields.email;
            user.local.password = user.generateHash(fields.password);

            user.save(function() {
                return res.redirect('/admin/account');
            });
        } else {
            user.name = fields.name;
            user.local.email = fields.email;

            user.save(function() {
                return res.redirect('/admin/account');
            });
        }
        
    });

};