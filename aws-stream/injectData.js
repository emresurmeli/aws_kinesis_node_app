// Create some random data

function writeToKinesis(streamName) {
  var randomNumber = Math.floor(Math.random() * 100000);
  var data         = 'data-' + randomNumber;
  var partitionKey = 'pk-' + randomNumber;
  var recordParams = {
    Data: data,
    PartitionKey: partitionKey,
    StreamName: streamName
  };

  kinesis.putRecord(recordParams, function(err, data) {
    if(err) {
      console.error(err);
    }
  });
}

module.exports = writeToKinesis;
