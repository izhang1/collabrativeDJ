var mongoose = require('mongoose');

var Song = new mongoose.Schema({
    song_uri: String,
    score: Number
});

var Playlist = new mongoose.Schema({
    id: String,
    user_id: Number,
    access_token: String,
    songs: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Song'} ]
});

module.exports = {
    Song: mongoose.model('Song', Song),
    Playlist: mongoose.model('Playlist', Playlist)
}
