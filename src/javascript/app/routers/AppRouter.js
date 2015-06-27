var Marionette = require('backbone.marionette');
var AppController = require('controllers/AppController.js');
var channels = require('channels');
var _ = require('lodash');

var AppRouter = Marionette.AppRouter.extend({

    appRoutes: {
        '(/)': 'home',
        'about(/)': 'about',
        'success(/)': 'success',
        'contact(/)': 'contact',
        '*default': 'defaultHandler'
    },

    controller: new AppController(),

    onRoute: function (name, path, args) {
        channels.globalChannel.trigger('route:change', {
            routeName: name,
            routePath: path,
            routeArgs: args
        });
    },

});

var router = new AppRouter();

module.exports = router;
