var spotify = require('./services/spotify.js');
var assert = require('assert');

describe('spotify', function() {
    
    describe('#createPlaylist', function() {
        it('should create playlist successfully', function() {
            // TODO: Confirm that status back from Spotify is not an error
            // See "Response Format" here: https://developer.spotify.com/web-api/create-playlist/
            // assert.equal(spotify.createPlaylist()).eq
        });
    });
});
