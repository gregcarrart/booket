// Modernizr tests
require('browsernizr/test/canvas');
require('browsernizr/test/touchevents');
require('browsernizr/test/css/pointerevents');
require('browsernizr/test/css/transforms3d');
require('browsernizr/lib/addTest');
require('browsernizr/lib/domPrefixes');
require('browsernizr/lib/prefixed');
require('browsernizr/lib/prefixes');

// Browserizr must be required _after_ importing the tests
require('browsernizr');

var app = require('./app/app.js');
app.appRouter = require('./app/routers/AppRouter.js');
app.start();
