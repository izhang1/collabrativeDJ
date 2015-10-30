var mongoose = require('mongoose');

var Song = new mongoose.Schema({
    song_uri: String,
    score: Number
});

var Playlist = new mongoose.Schema({
    id: String,
    user_id: Number,
    access_token: String,
    songs: [ Song ]
});


module.exports = {
    Playlist: mongoose.model('Playlists', Playlist),
    Song: mongoose.model('Songs', Song)
}
