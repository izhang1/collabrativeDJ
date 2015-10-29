var mongoose = require('mongoose');

var Playlist = new mongoose.Schema({
    id: String,
    user_id: Number,
    access_token: String,
    songs: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Song'} ]
});

var Song = new mongoose.Schema({
    song_uri: String,
    score: Number
});

module.exports = {
    Playlist: mongoose.model('Playlists', Playlist),
    Song: mongoose.model('Songs', Song)
}
