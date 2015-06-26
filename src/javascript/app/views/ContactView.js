var app = require('app/app'),
    BaseLayoutView = require('./BaseLayoutView'),
    $ = require('jquery'),
    helpers = require('utils/helpers'),
    constants = require('utils/constants'),
    template = require('templates/contact.hbs');

module.exports = BaseLayoutView.extend({

    className: 'page page-contact',

    template: template,

    ui: {

    },

    events: {

    },

    initialize: function () {
        this.$html = $('html');
    },

    sendForm: function (e) {
        e.preventDefault();

        var email = new Email();
        var emailAddress = this.ui.emailSubmit.val();
        var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        if (emailAddress === '' || !regex.test(emailAddress)){
            this.ui.emailMessage.css('background-color', "#ffa3a3");
            this.ui.emailMessage.text('Please enter a valid email address.');
            this.ui.emailMessage.fadeIn(200);
        } else {
            email.save({
                data: emailAddress
            });
            this.ui.emailMessage.css('background-color', "#a0ed82");
            this.ui.emailMessage.text('Thank you! Your email has been added.');
            this.ui.emailMessage.fadeIn(200);

            setTimeout(_.bind(function() {
                this.ui.emailMessage.fadeOut(200);
            },this), 3000);

            this.ui.emailSubmit.val('');
        }
    }
});
