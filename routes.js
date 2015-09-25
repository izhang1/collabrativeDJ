var spotify = require('./services/spotify.js');

module.exports = function (app) {

    app.get('/', function(req, res) {
        res.send('ello m8');
    });

    app.get('/createPlaylist', function(req, res) {
        var userId = req.body.userId;
        var accessToken = req.body.accessToken;

        spotify.createPlaylist(userId, accessToken, function(error, response, body) {

            if (error) {
                // TODO: Handle it
            }

            res.send(response.statusCode);
        });
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
