var Marionette = require('backbone.marionette'),
    $ = require('jquery'),
    _ = require('lodash'),
    helpers = require('../utils/helpers'),
    BaseView = require('./BaseView');

module.exports = BaseView.extend({

    ui: {
        
    },

    events: {},

    initialize: function() {},

    onRender: function() {
        _.defer(_.bind(function () {
            helpers.setMeta(this.options.title);
        }, this));
    }

});
