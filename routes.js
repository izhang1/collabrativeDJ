var spotify = require('./services/spotify.js');

module.exports = function (app) {

    app.get('/', function(req, res) {
        res.send('ello m8');
    });

    app.get('/createPlaylist', function(req, res) {
        spotify.createPlaylist();
        res.send('created playlist');
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
