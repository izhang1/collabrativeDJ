var spotify = require('../services/spotify.js');
var assert = require('assert');

// NOTE: This token will expire - will need to update
var ACCESS_TOKEN = 'BQCBShEW3snIl9nge7NHZATbB8YSXaaABHCeYTM_r9lFu-_eIegrnoAnmAkzDAJUFF0bXMNIvSCUpxzB_oRnaRqHOQJr540qH1TQwjxWIy6lEGaDzxnQCBCO7DQqPRgXUHOctuSpGyHMqNyNAE2Z2gkjvw0-_qmeLZH8SlhZX6VXv4lq0aEq4oq4liUHavjAm6tjSuJHGEFS7g4xoNsOkZrdu-3JXrGAvQYDevg';

describe('spotify', function() {
    
    describe('#createPlaylist', function() {
        it('should create playlist successfully', function(done) {

            var userId = '1229748481';

            spotify.createPlaylist(userId, ACCESS_TOKEN, function(error, response, body) {
                    if (error) throw error;

                    // assert that the status code is acceptable
                    assert.equal([200, 201].indexOf(response.statusCode) === -1, false);

                    done();
                }
            );
        });
    });
});
