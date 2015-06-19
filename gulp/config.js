var dest = './build';
var src = './src';
var modRewrite = require('connect-modrewrite');

module.exports = {
    browserSync: {
        baseDir: dest,
        proxy: 'localhost:8088'
    },
    sass: {
        src: src + '/sass/**/*.{sass,scss}',
        dest: dest + '/css',
        settings: {
            // Required if you want to use SASS syntax
            // See https://github.com/dlmanning/gulp-sass/issues/81
            sourceComments: 'map',
            imagePath: '/images' // Used by the image-url helper
        }
    },
    images: {
        src: src + '/images/**',
        dest: dest + '/images'
    },
    fonts: {
        src: src + "/fonts/*",
        dest: dest + "/fonts"
    },
    markup: {
        src: src + '/html/**/*.html',
        dest: dest
    },
    imagesPreload: {
        src: dest + "/css/styles.css",
        imagesDir: '../images',
        extensionsAllowed: ['.png', '.gif', '.jpg'],
        dest: src + '/javascript',
        filename: 'imagesToPreload.js'
    },
    browserify: {
        // A separate bundle will be generated for each
        // bundle config in the list below
        src: src,
        bundleConfigs: [{
            entries: src + '/javascript/main.js',
            dest: dest + '/js',
            outputName: 'main.js',
            // Additional file extentions to make optional
            extensions: ['.coffee', '.js', '.hbs'],
            // list of modules to make require-able externally
            //require: ['some-module', 'another-module']
        }]
    },
    production: {
        cssSrc: dest + '/css/*.css',
        jsSrc: dest + '/js/*.js',
        dest: dest
    },
    settings: {
        src: './settings.json',
        dest: dest
    },
    nodemon: {
        script: './server.js',
        ext: 'js html',
        ignore: ['src/*', 'build/*', 'node_modules/**'],
        env: {
            'NODE_ENV': 'dev'
        },
        'no-preload': true,
    }
};
