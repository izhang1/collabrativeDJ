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
	var song = req.body.song;

	spotify.searchSong(song, function(error, response, body) {

            if(error) {
              // TODO: Handle error
            }

            res.send(response.statusCode);
        });

    });

    app.post('/addSong', function(req, res) {
        var userId = req.body.userId;
	var playlistId = req.body.playlistId;
        var accessToken = req.body.accessToken;
	var songUri = req.body.songUri;

	spotify.addSong(userId, playlistId, accessToken, songUri, function(error, response, body) {

	  if(error) {
	    // TODO: Handle error
	  }

	  res.send(response.statusCode);
	});
    });

    app.post('/voteSong', function(req, res) {
        var vote = req.body.vote;

    });

    app.post('/deleteSong', function(req, res) {
        var userId = req.body.userId;
	var playlistId = req.body.playlistId;
        var accessToken = req.body.accessToken;
	var songUri = req.body.songUri;

	spotify.deleteSong(userId, playlistId, accessToken, songUri, function(error, response, body) {

	  if(error) {
	    // TODO: Handle error
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
