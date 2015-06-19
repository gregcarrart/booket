var Marionette = require('backbone.marionette'),
    Velocity = require('velocity-animate'),
    helpers = require('../utils/helpers'),
    _ = require('lodash');

module.exports = Marionette.ItemView.extend({

    initialize: function() {},

    onShow: function() {
        this.delegateEvents();
        helpers.scrollTo('.header');
    },

    templateHelpers: function() {
        return {
            assetsUrl: app.assetsUrl
        };
    },

    // Animate In...
    // then trigger 'animateIn' to let the region know that you're done
    animateIn: function() {
        Velocity(this.el, {
            opacity: 1
        }, {
            duration: 600,
            complete: _.bind(this.trigger, this, 'animateIn')
        });
    },

    // Animate Out...
    // then trigger 'animateOut' to let the region know that you're done
    animateOut: function() {
        Velocity(this.el, {
            opacity: 0
        }, {
            duration: 300,
            complete: _.bind(this.trigger, this, 'animateOut')
        });
    }

});
