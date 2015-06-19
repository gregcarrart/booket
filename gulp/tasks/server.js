var changed = require('gulp-changed'),
    gulp = require('gulp'),
    config = require('../config').nodemon,
    nodemon = require('gulp-nodemon');

gulp.task('nodemon', function () {
    return nodemon(config)
        .on('restart', function () {
            console.log('--- server restarted ---');
        });
});
