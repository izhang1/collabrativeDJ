var spotify = require('./services/spotify.js');

module.exports = function (app) {

    app.get('/', function(req, res) {
        res.send('ello m8');
    });

    app.post('/createPlaylist', function(req, res) {
        var userId = req.body.userId;
        var accessToken = req.body.accessToken;

	// Generate random code to join playlist
	var timeNow = new Date();
	var seconds = timeNow.getSeconds();
	var randomNumber = Math.floor((Math.random() * 1000) + 1);
	var playlistJoinCode = seconds.toString() + randomNumber.toString();

        spotify.createPlaylist(userId, accessToken, function(error, response, body) {

            if (error) {
                // TODO: Handle it
            }

            res.send(response.statusCode);
        });

	// TODO: add code to store above playlist join code in database with playlistId created
	// and the userId

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
        var accessToken = req.body.accessToken;
	var songUri = req.body.songUri;
	var playlistCode = req.body.playlistCode;

	//TODO: Search database to find corresponding playlistId and userId that code matches with.
	// If neither exist, return 404

	spotify.addSong(userId, playlistId, accessToken, songUri, function(error, response, body) {

	  if(error) {
	    // TODO: Handle error
	  }

	  res.send(response.statusCode);
	});
    });

    app.post('/voteSong', function(req, res) {
        var vote = req.body.vote;
	var playlistCode = req.body.playlistCode;

	//TODO: search database for playlistID corresponding to playlistCode,
	// then find song in that playlist's table and +1 the vote count for it.
	// If neither the playlist or song exist, return 404

    });

    app.post('/deleteSong', function(req, res) {
        var userId = req.body.userId;
	var playlistCode = req.body.playlistCode;
        var accessToken = req.body.accessToken;
	var songUri = req.body.songUri;

	//TODO: Search database for playlistId and userId that matches playlistCode, 
	// return 404 if not found

	spotify.deleteSong(userId, playlistId, accessToken, songUri, function(error, response, body) {

	  if(error) {
	    // TODO: Handle error
	  }
	  else {
	    // TODO: At this point, we know the user making this request is the playlist owner,
	    // so delete the song from our database too.
	  }

	  res.send(response.statusCode);
	});

    });

    app.post('/joinPlaylist', function(req, res) {
	var joinCode = req.body.joinCode;
	
	//TODO: Search database to see if above code exists, if it doesn't return 404
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
