var app = require('app/app'),
    $ = require('jquery'),
    _ = require('lodash'),
    template = require('templates/nav.hbs'),
    channels = require('channels'),
    BaseLayoutView = require('views/BaseLayoutView'),
    helpers = require('utils/helpers'),
    constants = require('utils/constants'),
    Velocity = require('velocity-animate');

module.exports = BaseLayoutView.extend({

    tagName: 'nav',

    className: 'nav-fixed',

    template: template,

    ui: {
        navLink: 'a',
    },

    events: {
        'click': 'onClickNav'
    },

    initialize: function() {
        this.win = $(window);

        this.listenTo(channels.globalChannel, 'route:change', this.onRouteChange);
    },

    onShow: function() {
       // this.setNavLayout();
    },
    
    onClickNav: function(e) {
        this.closeMenu();
    },

    openMenu: function () {
        helpers.addTopLevelClass(constants.MENU_OPEN_CLASS);
    },

    closeMenu: function () {
        helpers.removeTopLevelClass(constants.MENU_OPEN_CLASS);
    },

    onRouteChange: function (options) {
        var path = {
            'work': '/work',
            'about': '/about',
            'blog': '/blog',
            'contact': '/contact',
        }[options.routeName];

        if (path !== undefined) {
            this.ui.navLink.removeClass('nav-active');
            this.ui.navLink.filter('[href^="' + path + '"]').addClass('nav-active');
        }
    }

});
