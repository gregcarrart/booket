module.exports = function(app, passport, calendar, user, settings, dashboard, bookings, account) {
// normal routes ===============================================================
    var validPaths = [
        '/'
    ];

    validPaths.forEach(function (path) {
        app.get(path, function (req, res) {
            return res.render('index', {
                layout: null
            });
        });
    });

    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('admin/sign-up.hbs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/admin/twitter-approval', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    //EMAIL
    /*app.post('/contact', contact.submit);*/

    //ADMIN.......................................................................
    //LOGIN///////////////////////////////////////////////////////////////////////
    app.get('/admin', function(req, res) {
        res.render('admin/index.hbs', {
            title : 'Booket CMS - Admin'
        });
    });


    //DASHBOARD PAGE///////////////////////////////////////////////////////////
    app.get('/admin/dashboard', isLoggedIn, dashboard.index, passport.authenticate('local', { session: false }));


    //BOOKINGS PAGE////////////////////////////////////////////////////////////
    app.get('/admin/bookings', isLoggedIn, bookings.index, passport.authenticate('local', { session: false }));


    //ACCOUNT PAGE//////////////////////////////////////////////////////////////
    app.get('/admin/account', isLoggedIn, account.index, passport.authenticate('local', { session: false }));



    //SETTINGS PAGE/////////////////////////////////////////////////////////////
    app.param('settingsId', settings.load);

    app.get('/admin/settings', isLoggedIn, settings.index, passport.authenticate('local', { session: false }));
    app.post('/admin/settings/:settingsId', isLoggedIn, settings.update, passport.authenticate('local', { session: false }));


    //USERS/////////////////////////////////////////////////////////////////////
    app.param('userId', user.load);
    app.param('userId', user.loadBySlug);

    //list user
    app.get('/admin/users', isLoggedIn, user.index, passport.authenticate('local', { session: false }));
    app.get('/admin/users/page/:page?', isLoggedIn, user.index, passport.authenticate('local', { session: false }));

    //create user
    app.post('/admin/users', isLoggedIn, user.create, passport.authenticate('local', { session: false }));
    app.get('/admin/users/add_new', isLoggedIn, user.new, passport.authenticate('local', { session: false }));

    //delete user
    app.get('/admin/users/:userId/destroy', isLoggedIn, user.destroy, passport.authenticate('local', { session: false }));

    //edit user (full editor)
    app.post('/admin/users/:userId', isLoggedIn, user.update, passport.authenticate('local', { session: false }));
    app.get('/admin/users/:userId', isLoggedIn, user.edit, passport.authenticate('local', { session: false }));



    //CALENDAR ITEMS /////////////////////////////////////////////////////////////
    app.param('calendarId', calendar.load);
    app.param('calendarSlug', calendar.loadBySlug);

    //list appointments
    app.get('/admin/calendar-item', isLoggedIn, calendar.index, passport.authenticate('local', { session: false }));
    app.get('/admin/calendar-item/page/:page?', isLoggedIn, calendar.index, passport.authenticate('local', { session: false }));

    //create appointments
    app.post('/admin/calendar-item', isLoggedIn, calendar.create, passport.authenticate('google', { session: false }));
    app.get('/admin/calendar-item/add_new', isLoggedIn, calendar.new, passport.authenticate('local', { session: false }));

    //delete appointments
    app.get('/admin/calendar-item/:calendarId/destroy', isLoggedIn, calendar.destroy, passport.authenticate('local', { session: false }));

    //edit appointments (full editor)
    app.post('/admin/calendar-item/:calendarId', isLoggedIn, calendar.update, passport.authenticate('local', { session: false }));
    app.get('/admin/calendar-item/:calendarId', isLoggedIn, calendar.edit, passport.authenticate('local', { session: false }));

    //API
    app.get('/api/v1/calendar', calendar.all);



    //post appointment
    app.post('/submit-appointment', calendar.clientCreate);




    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/admin');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('/admin/index.html', { error: req.flash('error') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : 'admin/dashboard', // redirect to the secure twitter-approval section
            failureRedirect : '/admin', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.html', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/calendar-item', // redirect to the secure twitter-approval section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        //app.get('/google-auth', passport.authenticate('google', {session: false}));

       /*app.get('/auth/google/callback', 
          passport.authenticate('google', { session: false, failureRedirect: '/login' }),
          function(req, res) { 
            req.session.access_token = req.user.accessToken;
            res.redirect('/admin/calendar-item');
          });*/

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/admin');
}
