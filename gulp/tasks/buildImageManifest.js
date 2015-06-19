var gulp = require('gulp');
var config = require('../config').imagesPreload;
var cssImageManifest = require('gulp-css-image-manifest');

var buildImageManifest = function () {
    return gulp.src(config.src)
        .pipe(cssImageManifest({
            baseDir: config.imagesDir,
            extensionsAllowed: ['.png', '.svg', '.gif', '.jpg']
        }))
        .pipe(gulp.dest(config.dest));
};

gulp.task('buildImageManifest', buildImageManifest);

module.exports = buildImageManifest;
