var spotify = require('./services/spotify.js');
var db = require('./models.js');
var _ = require('lodash');

// Utility function to sort an JSON array of JSON objects
// by a specific key
var sortByKey = function (array, key, order) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (order === 'a') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        else {
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        }
    });
};

// Internal function for getting a JSON list of song objects
// for a specific playlist in order of score
// callback signature: cb(err, playlist)
var getPlaylist = function(playlistId, cb) {
    db.Playlist.findOne({id: playlistId})
    .exec(function(err, pl) {
        // check error
        if (err) {
            cb(err, null);
        }

        // check null
        if ( pl == null ) {
            cb("Playlist does not exist", null);
        }   

        // sort the songs
        pl.songs = sortByKey(pl.songs, 'score', 'd');

        // invoke the callback
        cb(null, pl);
    });
};

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
                } else {
                    console.log('Successfully saved new playlist: ' + new_playlist);
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

        db.Playlist.findOne({id: playlistId}).exec(function(err, playlist){
            if(err) {
                console.log('couldn\'t find playlist in db');
                res.send(500);
            }

            spotify.searchTrack(track, playlist.access_token, function(error, response, body) {
                if(error) {
                    console.log(error);
                    res.send(error.status);
                }

                res.send(body);  // Change this to res.sendStatus(200) for a bug, as its supposed to return the found info and not 200
            });
        });
    });

    app.post('/addTrack', function(req, res) {
        var playlistId = req.body.playlistId;
        var trackUri = req.body.trackUri;
        var trackName = req.body.trackName;

        db.Playlist.findOne({id: playlistId}).exec(function(err, playlist){
            if(err) {
                res.send(500);
            }

            spotify.addTrack(playlist.user_id, playlist.id, playlist.access_token, trackUri, function(error, response, body) {
                if(error) {
                    res.send(error.status);
                }

                var newSong = new db.Song({
                    song_uri: trackUri,
                    track_name: trackName,
                    score: 0  // Change this to -1 for a bug, so the first vote won't count
                });

                playlist.songs.push(newSong);
                playlist.save(function(err){
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    }

                    getPlaylist(playlist.id, function(err, pl) {
                        // check error
                        if (err) {
                            console.log(err);
                            res.send(500);
                            return;
                        }

                        // check null
                        if ( pl == null ) {
                            res.send(500);
                            return;
                        }
                        io.emit(pl, JSON);
                        res.send(200);
                    });
                });
            });
        });
    });

    app.post('/voteSong', function(req, res) {
        var vote = req.body.vote;
        var playlistId = req.body.playlistId;
        var trackUri = req.body.trackUri;

        // validate vote (either 1 or -1)
        if ( !( vote == 1 || vote == -1 ) ) {
            res.send(500);
        }

        // get the song we want to apply the vote to
        db.Playlist.findOne({ id: playlistId })
        .exec(function(err, pl) {

            // check error
            if (err) {
                console.log(err);
                res.send(500);
                return;
            }

            // check null
            if ( pl == null ) {
                res.send(500);
                return;
            }

            // find the correct song
            var song_index = _.indexOf(pl.songs.map(function(x) {return x.song_uri}), trackUri);

            // update the song
            if ( song_index != -1 ) {
                pl.songs[song_index].score += parseInt(vote);
                pl.save(function(err){
                    if (err) {
                        console.log(err);
                        res.send(500);
                    }

                    getPlaylist(playlist.id, function(err, pl) {
                        // check error
                        if (err) {
                            console.log(err);
                            res.send(500);
                            return;
                        }

                        // check null
                        if ( pl == null ) {
                            res.send(500);
                            return;
                        }
                        io.emit(pl, JSON);
                        res.send(200);
                    });
                });
            }
            else {
                res.send(404);
            }
        });

    });

};
