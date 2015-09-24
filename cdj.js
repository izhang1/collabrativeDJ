var express    = require('express');
var path       = require('path');
var fs         = require('fs');
var session    = require('express-session');
var bodyParser = require('body-parser');
var http       = require('http');
var logger     = require('morgan');
var passport   = require('passport');
var spotify    = require('passport-spotify');

var config     = null;
var app        = express();

// Passport serialize the user into the session
passport.serializeUser(function(user, done) {
      done(null, user);
});

// Passport deserialize the user out of the session
passport.deserializeUser(function(obj, done) {
      done(null, obj);
});

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.send(401);
    res.end();
    return;
}

fs.readFile("config.json", 'utf8', function(err, data) {
    if (err) {
        if (err.code == 'ENOENT')
            console.log("Could not find any config file.");
        process.exit(-1);
    }

    try {
        config = JSON.parse(data);
    }
    catch(e) {
        console.log("readFile Parse Error: ", e);
        process.exit(-1);
    }

    // get config (defaults to development)
    var configName = process.argv[2] || 'development';

    // get port number
    var port = config[configName].port;

    console.log(configName);
    console.log("Server port: " + port);

    // all environments
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

    // Set up passport authentication with spotify
    passport.use(new spotify.Strategy(
        {
            clientID: config[configName].spotify.appID,
            clientSecret: config[configName].spotify.appSecret,
        },
        function(accessToken, refreshToken, profile, done) {
            // find or create DB row for user here
        }
    ));

    // Set up globals in the req object.
    // Do this first or they will not show up in the req.
    app.use(function(req, res, next) {
        req.configName = configName;
        next();
    });

    app.use(session({
        secret: 'boilerup',
        cookie: {secure: false},
        resave: true,
        saveUninitialized: true
    }));

    app.set('port', process.env.PORT || port);
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: 'false'}));
    app.use(passport.initialize());
    app.use(passport.session());


    // REQUESTS

    // login with passport spotify
    app.post('/login/spotify', passport.authenticate('spotify'), function(req,res){
        res.send(200);
        res.end();
    });

    // logout with passport spotify
    app.get('/logout', ensureAuthenticated, function(req, res){
        req.logout();
        res.send(200);
        res.end();
    });

    // start server
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'))
    });

});
