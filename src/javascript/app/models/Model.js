var BaseCollection = require('collections/BaseCollection'),
    Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    url: '/api/v1/about'
});
