var Backbone = require('backbone'),
    _ = require('lodash');

module.exports = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: '/submit-appointment',
    type: 'POST'
});
