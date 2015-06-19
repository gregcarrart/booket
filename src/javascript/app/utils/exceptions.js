var exports = {};

var NotFoundError = function (message) {
    this.message = message + ' could not be found';
};
NotFoundError.prototype = new Error();
exports.NotFoundError = global.NotFoundError = NotFoundError;

var ModelNotFoundError = function (model, key) {
    this.model = model;
    this.key = key;
    this.message = this.model + ' identified by "' + this.key + '" could not be found.';
};
ModelNotFoundError.prototype = new NotFoundError();
exports.ModelNotFoundError = global.ModelNotFoundError = ModelNotFoundError;

module.exports = exports;
