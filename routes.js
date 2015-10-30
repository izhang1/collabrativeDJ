var spotify = require('./services/spotify.js');
var db = require('./models.js');

module.exports = function (app, io) {

    // basic socket.io logging
    io.on('connection', function(socket) {
        console.log('user connected');
        socket.on('disconnect', function() {
            console.log('user disconnected');
        });
    });

    app.get('/', function(req, res) {
        res.send('ello m8');
    });

    app.post('/createPlaylist', function(req, res) {
        var userId = req.body.userId;
        var accessToken = req.body.accessToken;

        // create a playlist with spotify service
        spotify.createPlaylist(userId, accessToken, function(error, response, playlist) {
            if (error) {
                console.log(error);
                res.sendStatus(response.statusCode);
            }

            // create new playlist record in the DB
            var new_playlist = new db.Playlist({
                id: playlist.id,
                user_id: userId,
                access_token: accessToken
            });

            new_playlist.save(function (err) {
                if (err) {
                    console.log('Error on save: ', err);
                }

                var resp_data = {
                    statusCode: response.statusCode,
                    playlistId: playlist.id
                };

                res.send(JSON.stringify(resp_data));
            });
        });
    });


    // Check to see if a playlist to join exists
    app.post('/checkPlaylist', function(req, res) {
        var playlistId = req.body.playlistId;

        // find playlist in db
        db.Playlist.findOne({ id: playlistId }).exec(function(err, pl) {
            if (err) {
                console.log(err);
                res.send(500);
                return;
            }

            if ( pl !== null ) {
                // playlist exists
                res.send(200);
            } else {
                // playlist does not exist
                res.send(404);
            }
        });
    });

    app.get('/playlist/:playlistId', function(req, res) {
        var playlistId = req.params.playlistId;

        db.Playlist.findOne({id: playlistId}).exec(function(err, playlist) {
            if (err) {
                console.log(err);
                res.send(500);
                return;
            }

            // TODO: Confirm that this data is complete/in the correct form
            res.send(playlist);
        });
    });

    app.post('/searchTrack', function(req, res) {
        var track = req.body.track;
	var playlistId = req.body.playlistId;

	var accessToken = db.Playlist.findOne({id: playlistId})
	.exec(function(err, playlist){

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
        var playlistId = req.body.playlistId;

        db.Playlist.findOne({id: playlistId}).exec(function(err, playlist){
            if(err) {
                res.send(500);
            }

            spotify.addSong(playlist.user_id, playlist.id, playlist.access_token, trackUri, function(error, response, body) {

                if(error) {
                    res.send(error.status);
                }

                var newSong = new db.Song({
                    song_uri: track_uri,
                    score: 0
                });

                playlist.songs.push(newSong)
                .save(function(err){
                    res.send(500);
                });

                // io.emit('playlist updated', JSON);
                res.send(response.statusCode);
            });
        });
    });

    app.post('/voteSong', function(req, res) {
        var vote = req.body.vote;
        var playlistCode = req.body.playlistCode;

        //TODO: search database for playlistID corresponding to playlistCode,
        // then find song in that playlist's table and +1 the vote count for it.
        // If neither the playlist or song exist, return 404

        // io.emit('playlist updated', JSON);
    });

    // app.post('/deleteSong', function(req, res) {
    //     var userId = req.body.userId;
    //     var playlistCode = req.body.playlistCode;
    //     var accessToken = req.body.accessToken;
    //     var songUri = req.body.songUri;

    //     //TODO: Search database for playlistId and userId that matches playlistCode, 
    //     // return 404 if not found

    //     spotify.deleteSong(userId, playlistId, accessToken, songUri, function(error, response, body) {

    //         if(error) {
    //             // TODO: Handle error
    //         }
    //         else {
    //             // TODO: At this point, we know the user making this request is the playlist owner,
    //             // so delete the song from our database too.
    //         }

    //         res.send(response.statusCode);
    //     });

    // });

};
