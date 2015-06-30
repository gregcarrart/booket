var express         = require('express'),
    app             = express(),
    port            = process.env.PORT || 8088,
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    flash           = require('connect-flash'),
    fs              = require('fs'),
    aws             = require('aws-sdk'),
    path            = require('path'),

    morgan       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    session      = require('express-session'),

    calendar     = require('./server/controllers/calendar.js'),
    user    = require('./server/controllers/user.js'),
    settings = require('./server/controllers/settings.js'),
    dashboard = require('./server/controllers/dashboard.js'),
    bookings = require('./server/controllers/bookings.js'),
    account = require('./server/controllers/account.js'),

    exphbs = require('express-handlebars'),
    config = require('config'),
    transporter;

//Detect NODE_ENV
switch(config.util.getEnv('NODE_ENV')){
    case 'dev':
        var configDB = config.get('Dev');

        mongoose.connect(configDB.url);
         
        break;

    case 'production':

        mongoose.connect(process.env.MONGO_DB);
        
        break;

    default:
        console.log('env error');
}

// configuration ================================================================

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname + '/server', 'views'));
app.engine('hbs', exphbs({
extname: '.hbs',
defaultLayout: 'main',
layoutsDir: './server/views/layouts/',
partialsDir: './server/views/partials/',
helpers: {
    returnSelected: function(val) {
        if (val)
            return "checked";
        else
            return "";
    },

    hasImages: function(obj) {
        if (obj.length > 0) {
            return true;
        } else {
            return false;
        }
    },

    select: function(val1, val2) {
        if (val1 === val2) {
            return "selected";
        } else {
            return "";
        }
    },

    assetsUrl: function() {
        return process.env['ASSETS_URL'] || '/';
    },

    assetsUrlAdmin: function(url) {
        var newPath = process.env['ASSETS_URL'] || '';
        newPath = ("/" + newPath + url).split('//').join('/');
        return newPath;
    },

    formatDate: function(date) {
        var value = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

        return value;
    },

    equalsTo: function(v1, v2, options) {
        if (v1 === v2) { return options.fn(this); } 
        else { return options.inverse(this); } 
    },

    ifCond: function(v1, v2, options) {
        if(v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    },

    hours: function(day, openClose, options) {
        var markup = '<select name=hours.'+day+'.'+openClose+' class="form-control">' +
                        '<option disabled selected>Select</option>' +
                        '<option value="1">1:00 am</option>' +
                        '<option value="2">2:00 am</option>' +
                        '<option value="3">3:00 am</option>' +
                        '<option value="4">4:00 am</option>' +
                        '<option value="5">5:00 am</option>' +
                        '<option value="6">6:00 am</option>' +
                        '<option value="7">7:00 am</option>' +
                        '<option value="8">8:00 am</option>' +
                        '<option value="9">9:00 am</option>' +
                        '<option value="10">10:00 am</option>' +
                        '<option value="11">11:00 am</option>' +
                        '<option value="12">12:00 pm</option>' +
                        '<option value="13">1:00 pm</option>' +
                        '<option value="14">2:00 pm</option>' +
                        '<option value="15">3:00 pm</option>' +
                        '<option value="16">4:00 pm</option>' +
                        '<option value="17">5:00 pm</option>' +
                        '<option value="18">6:00 pm</option>' +
                        '<option value="19">7:00 pm</option>' +
                        '<option value="20">8:00 pm</option>' +
                        '<option value="21">9:00 pm</option>' +
                        '<option value="22">10:00 pm</option>' +
                        '<option value="23">11:00 pm</option>' +
                        '<option value="24">12:00 am</option>' +
                    '</select>';
        return markup;
    }
}
}));
app.set('view engine', '.hbs');

//app.use(express.static(__dirname));;

// required for passport
app.use(session({ secret: 'secrets' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

if (!process.env['ASSETS_URL']) {
    app.use(express.static(path.join(__dirname, 'build')));
}

// routes ======================================================================
require('./server/routes/routes.js')(app, passport, calendar, user, settings, dashboard, bookings, account); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

