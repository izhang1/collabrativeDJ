var mongoose = require('mongoose');

var Song = new mongoose.Schema({
    song_uri: String,
    score: Number,
    track_name: String
});

var Playlist = new mongoose.Schema({
    id: String,
    user_id: String,
    access_token: String,
    songs: [ Song ]
});

module.exports = {
    Song: mongoose.model('Song', Song),
    Playlist: mongoose.model('Playlist', Playlist)
}
