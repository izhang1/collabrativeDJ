var spotify = require('../services/spotify.js');
var assert = require('assert');

describe('spotify', function() {
    
    describe('#createPlaylist', function() {
        it('should create playlist successfully', function(done) {

            // NOTE: This token will expire - will need to update
            var userId = '1229748481';
            var accessToken = 'BQCNbo6usySUuQck2-tWh4OzZCNjTMTc1WNpOJWMlWwjNXCzf_R059qbA79ZXbF4fP92R6AvEeY7M5saOL2zTRo6F4Mg4Vvra7ViVcY8CitP1Td2tE5dLLvc_V-Gchyl6Q77uhHBEh3-wiKR1fXUXSsZ3EYBkt6Vro_BDFbQMKLn_rgZvD28aV_N09k';

            spotify.createPlaylist(
                userId,
                accessToken,
                function(error, response, body) {
                    if (error) throw error;

                    // assert that the status code is acceptable
                    assert.equal([200, 201].indexOf(response.statusCode) === -1, false);

                    done();
                }
            );
        });
    });
});
