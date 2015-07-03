var Backbone = require('backbone'),
	constants = require('utils/constants'),
    _ = require('lodash');

module.exports = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: constants.USER_ID + '/settings',
    type: 'GET'
});
