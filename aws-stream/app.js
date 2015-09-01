// Create a stream with 2 shards and put the data into the
// stream after it is ACTIVE
var createStream   = require('./createStream.js');
var writeToKinesis = require('./injectData.js');


createStream('TestStream', 2, function(err) {
  if(err) {
    console.error('Error starting Kinesis producer: ' + err);
    return;
  }
  for(var i = 0; i < 10; ++i) {
    writeToKinesis('TestStream');
  }
});
