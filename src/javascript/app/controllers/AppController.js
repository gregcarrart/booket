var app = require('app/app'),
    Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    constants = require('utils/constants'),
    channels = require('channels'),
    helpers = require('../utils/helpers'),
    Bluebird = require('bluebird'),
    siteTitle = 'booket | ',
    pageTitle,

    // Views
    GlobalView = require('views/GlobalView'),
    BaseView = require('views/BaseView'),
    IndexView = require('views/IndexView'),
    HeaderView = require('views/HeaderView'),
    NavView = require('views/NavView'),
    AboutView = require('views/AboutView'),
    ContactView = require('views/ContactView'),
    AppointmentView = require('views/AppointmentView'),

    // Collections
    Calendars = require('collections/Calendars.js'),
    User = require('collections/User.js');

    //Models
    //User = require('models/User.js');

//Utilies
var preloaders = app.preloaders;

module.exports = Backbone.Marionette.Controller.extend({

    lastRoute: null,

    initialize: function () {

        // State checks
        app.onload = true;

        // Bootstrap it, gurrl
        this.bootstrap();

    },

    bootstrap: function () {
        this.globalView = new GlobalView();
        this.baseView = new BaseView();
        this.headerView = new HeaderView();

        app.regionHeader.show(this.headerView);

        channels.globalChannel.on('navigate', this.navigate, this);

        this.collections = {};

        this.collections.calendars = new Calendars();
        this.collections.calendars.fetch();

        this.collections.user = new User();
        this.collections.user.fetch();

        _.each(preloaders, _.bind(function (settings, identifier) {
            if (!settings.routeDependent) {
                settings.preload(this.collections);
            }
        }, this));

    },

    onBeforeNavigate: function (options) {
        if (this.lastRoute instanceof(Bluebird) && this.lastRoute.isPending()) {
            this.lastRoute.cancellable().catch(function(e) {
                console.error(e);
            }).cancel('Route changed before load finished');
        }
    },

    navigate: function (options) {
        this.triggerMethod('before:navigate', options);

        // If navigate() is being called...
        // we must be past our initial page load
        // so we'll set onload to 'false'
        app.onload = false;

        var url = options.url;
        var trigger = options.trigger ? options.trigger : false;

        app.appRouter.navigate(url, {
            trigger: trigger
        });

    },

    /* View Routes
    =========================================== */

    home: function () {
        pageTitle = siteTitle + 'home';
        document.title = pageTitle;

        this.lastRoute = preloaders.home.preload(this.collections).spread(function (user, calendars) {
            var view = new IndexView({
                collection: calendars,
                user: user,
                title: pageTitle
            });

            app.regionMain.show(view);
        });
    },

    about: function () {
        pageTitle = siteTitle + 'about';
        document.title = siteTitle + 'about';
    },

    contact: function () {
        document.title = siteTitle + 'contact';

        app.regionMain.show(new ContactView({
            title: pageTitle
        }));
    },

    success: function () {
        pageTitle = siteTitle + 'thank you';
        document.title = pageTitle;

        var view = new AppointmentView({
            collection: this.collections.calendars,
            title: pageTitle
        });

        app.regionMain.show(view);
    },

    defaultHandler: function (route) {
        console.log('%cRoute /%s does not exist', 'color:white; background:gray; padding: 0 0.25em', route);
    }

});
