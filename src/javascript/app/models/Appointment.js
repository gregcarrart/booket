var Backbone = require('backbone'),
	constants = require('utils/constants'),
    _ = require('lodash');

module.exports = Backbone.Model.extend({
    idAttribute: '_id',
    type: 'POST'
});
