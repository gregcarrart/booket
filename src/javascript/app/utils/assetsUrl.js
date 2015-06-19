var constants = require('utils/constants');

module.exports = function (path, sizeX, sizeY) {
    if (!path) {
        return;
    }

    // If path is a full qualified domain, either specifying
    // protocol scheme, e.g., http:// or ftp://, or not, i.e.,
    // assume the same protocol of main document (//).
    if (path.match(/^\/\//) || path.match(/^\w+:\/\//)) {
        return path;
    } else {
        // If path starts with a forward slash, i.e., full
        // pathname, we should remove that slash as
        // window.assetsUrl are expected to have a slash at
        // the end of the domain.
        if (path.charAt(0) == '/') {
            path = path.substring(1, path.length);
        }

        if (path.indexOf('cdn-image') === 0 && sizeX && sizeY) {
            //Image can be resized
            path = path + '/' + sizeX + '/' + sizeY;
        }

        return constants.ASSETS_URL + path;
    }
};
