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
        json: true,
    }, function(error, response, body) {
        if(error) {
            console.log('error: ' + JSON.stringify(error));
        }

        cb(error, response, body);
    });
};

module.exports = spotify;
