var spotify = require('./services/spotify.js');

module.exports = function (app) {

    app.get('/', function(req, res) {
        res.send('ello m8');
    });

    app.post('/createPlaylist', function(req, res) {
        var userId = req.body.userId;
        var accessToken = req.body.accessToken;

        spotify.createPlaylist(userId, accessToken, function(error, response, body) {

            if (error) {
                // TODO: Handle it
            }

            res.send(response.statusCode);
        });
    });

    app.get('/searchSong', function(req, res) {
        var userId = req.body.userId;
        var accessToken = req.body.accessToken;

    });

    app.post('/addSong', function(req, res) {
        var userId = req.body.userId;
        var accessToken = req.body.accessToken;  

    });

    app.post('/voteSong', function(req, res) {
        var userId = req.body.userId;
        var accessToken = req.body.accessToken;

    });

    app.post('/deleteSong', function(req, res) {
        var userId = req.body.userId;
        var accessToken = req.body.accessToken;

    });

    app.post('/savePlaylist', function(req, res) {

    });

};


// module.exports = function() {
//   var root;
//   root = express.Router();
//   root.use('*', function(req, res, next) {
//     res.setHeader('Content-Type', 'application/json');
//     return next();
//   });
//   
//   root.get('/', function(req, res) {
//     res.send('Hello bitch.');
//   });  
// 
//   return root;
// 
// };
