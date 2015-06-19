var Backbone = require('backbone'),
    _ = require('lodash');

module.exports = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: '/contact',
    type: 'POST'
});
