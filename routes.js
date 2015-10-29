var spotify = require('./services/spotify.js');
var db = require('./models.js');

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

        // create new record in the DB
        var new_playlist = new db.Playlist({
            id: playlistJoinCode,
            user_id: userId,
            access_token: accessToken
        });
        new_playlist.save(function (err) {if (err) console.log('Error on save!');});

        spotify.createPlaylist(userId, accessToken, function(error, response, body) {

            if (error) {
                // TODO: Handle it
                console.log(error);
            }

            res.send(response.statusCode);
        });

    });

    app.post('/searchTrack', function(req, res) {
        var track = req.body.track;
	var playlistId = req.body.playlistId;
	var accessToken = db.Playlist.findOne({id: playlistId}).exec(function(err, playlist){

	  spotify.searchTrack(track, playlist.access_token, function(error, response, body) {

            if(error) {
                res.send(error.status);
            }
	    
	    res.send(body);

          });

	  if(error) {
	    res.send(500);
	  }

	});
        

    });

    app.post('/addTrack', function(req, res) {
        var accessToken = req.body.accessToken;
        var trackUri = req.body.trackUri;
        var playlistId = req.body.playlistId

        var accessToken = db.Playlist.findOne({id: playlistId}).exec(function(err, playlist){

          spotify.addSong(playlist.user_id, playlist.id, playlist.access_token, trackUri, function(error, response, body) {

            if(error) {
                res.send(error.status);
            }

            res.send(response.statusCode);

          });

	  if(err) {
	    res.send(500);
	  }

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
