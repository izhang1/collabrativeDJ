var express    = require('express');
var fs         = require('fs');
var session    = require('express-session');
var bodyParser = require('body-parser');
var http       = require('http');
var logger     = require('morgan');
var mongoose   = require('mongoose');

var config     = null;
var app        = express();
var server     = http.createServer(app);
var io         = require('socket.io')(server);

var mongo_url = '';

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

    mongo_url = process.env.MONGOLAB_URI || config[configName].mongo_url;

    // connect to mongo server
    mongoose.connect(mongo_url, function (err, res) {
        if (err) {
            console.log ('ERROR connecting to: ' + mongo_url + '. ' + err);
        } else {
            console.log ('Succeeded connected to: ' + mongo_url);
        }
    });

    // all environments
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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

    // REQUESTS
    require('./routes.js')(app, io);

    // start server
    server.listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });

});
