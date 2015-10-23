var request = require('request');

var spotify = {};

spotify.createPlaylist = function(userId, accessToken, cb) {
    console.log('creating playlist');

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
        method: 'GET',
        headers: {
            'Authorization': authorization
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
        method: 'POST',
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


spotify.deleteSong = function(userId, playlistId, accessToken, songUri, cb){
    console.log('deleting song');

// Need to check what form songUri is passed in as
    var trackParam = "{ \"tracks\": [{ \"uri\": \"" + songUri + "\" }] }";
    var uri = "https://api.spotify.com/v1/users/" + userId + "/playlists/" + playlistId + "/tracks";
    
    var authorization = 'Bearer ' + accessToken;
    var body = {
        tracks: [{ uri: songUri }]
    };

    request({
        uri: uri,
        method: 'DELETE',
        headers: {
            'Authorization': authorization
        },
        body: body,
        json: true,
    }, function(error, response, body) {
        if(error) {
            console.log('error: ' + JSON.stringify(error));
        }

        cb(error, response, body);
    });

};

module.exports = spotify;
