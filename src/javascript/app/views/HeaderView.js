var app = require('app/app'),
    BaseLayoutView = require('./BaseLayoutView'),
    $ = require('jquery'),
    helpers = require('utils/helpers'),
    constants = require('utils/constants'),
    template = require('templates/header.hbs');

module.exports = BaseLayoutView.extend({

    tagName: 'header',

    className: 'header',

    template: template,

    ui: {
        btnHamburger: '.btn-hamburger',
        logo: '.nav-logo'
    },

    events: {
        'click @ui.btnHamburger': 'onClickHamburger',
        'click @ui.logo': 'onClickHome'
    },

    initialize: function () {
        this.$html = $('html');
    },

    onClickHamburger: function(e) {

        e.preventDefault();

        if (this.$html.hasClass(constants.MENU_OPEN_CLASS)) {
            helpers.removeTopLevelClass(constants.MENU_OPEN_CLASS);
        } else {
            helpers.addTopLevelClass(constants.MENU_OPEN_CLASS);
        }

    },

    onClickHome: function (e) {
        e.preventDefault();

        if (this.$html.hasClass(constants.MENU_OPEN_CLASS)) {
            helpers.removeTopLevelClass(constants.MENU_OPEN_CLASS);
        }
    }

});
