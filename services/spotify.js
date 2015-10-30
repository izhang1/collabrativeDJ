var request = require('request');

var spotify = {};

spotify.createPlaylist = function(userId, accessToken, cb) {
    console.log('creating playlist with userId \'' + userId + '\' and accessToken \'' + accessToken);

    // TODO: May want to create a common functions called by each of the spotify functions for making requests (and checking refresh status?)
    var uri = 'https://api.spotify.com/v1/users/' + userId + '/playlists';
    var authorization = 'Bearer ' + accessToken;
    var body = {
        name: 'New Playlist',
        public: true
    };

    request({
        uri: uri,
        method: 'POST',
        headers: {
            'Authorization': authorization
        },
        body: body,
        json: true
    }, function(error, response, body) {
        if(error) {
            console.log('error: ' + JSON.stringify(error));
        }

        cb(error, response, body);
    });
};


spotify.searchTrack = function(track, accessToken, cb){
    console.log('searching for track');

    var SEARCH_LIMIT = '5';

    var formattedTrack = track.replace(" ", "+");
    var uri = "https://api.spotify.com/v1/search?q=" + formattedTrack+ "&type=track&limit=" + SEARCH_LIMIT;
    var authorization = 'Bearer ' + accessToken;

    request({
        uri: uri,
        method: 'GET',  // Change this to POST for a bug
        headers: {
            'Authorization': authorization  // Change authorization to accessToken for a bug
        },
        json: true
    }, function(error, response, body) {
        if(error) {
            console.log('error: ' + JSON.stringify(error));
        }

        cb(error, response, body);
    });

};


spotify.addTrack = function(userId, playlistId, accessToken, songURI, cb){
    console.log('adding song to playlist');
    
    var uri = "https://api.spotify.com/v1/users/" + userId + "/playlists/" + playlistId + "/tracks?position=0&uris=" + songURI;
    var authorization = 'Bearer ' + accessToken;

    request({
        uri: uri,
        method: 'POST',  // Change this to GET for a bug
        headers: {
            'Authorization': authorization
        },
        json: true,
    }, function(error, response, body) {
        if(error) {
            console.log('error: ' + JSON.stringify(error));
        }

        cb(error, response, body);
    });

};

module.exports = spotify;
