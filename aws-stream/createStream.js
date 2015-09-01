var AWS     = require('aws-sdk');
var kinesis = new AWS.Kinesis({region: 'us-west-2'});

var createStream = function(streamName, numberOfShards, callback) {
  var params = {
    ShardCount: numberOfShards,
    StreamName: streamName
  };

  // Create new stream if it doesn't exist
  kinesis.createStream(params, function(err, data) {
    if(err && err.code !== 'ResourceInUseException') {
      callback(err);
      return;
    }
    // Make sure the stream is in the ACTIVE state before pushing data
    waitForStreamToBecomeActive(streamName, callback);
  });
}

function waitForStreamToBecomeActive(streamName, callback) {
  kinesis.describeStream({StreamName: streamName},
    function(err, data) {
      if(err) {
        callback(err);
        return;
      }

      if(data.StreamDescription.StreamStatus === 'ACTIVE') {
        callback();
      }
      // The stream is not ACTIVE yet. Wait for another 5 seconds
      // before checking the state again.
      else {
        setTimeout(function() {
          waitForStreamToBecomeActive(streamName, callback);
        }, 5000);
      }
    }
  );
}

module.exports = createStream;
