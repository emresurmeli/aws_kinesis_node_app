var async = require('async');
var AWS   = require('aws-sdk');
var fs    = require('fs');
var zlib  = require('zlib');

var s3    = new AWS.S3();

exports.kinesisHandler = function(records, context) {
  var data = records
    .map(function(record) {
      return new Buffer(record.kinesis.data, 'base64').toString('utf-8');
    }).join();
  doWork(data);
  context.done();
};

exports.s3Handler = function(record, context) {
  async.waterfall([
    function download(next) {
      s3.getObject({
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key
      }, function(err, data) {
        next(err, data);
      });
    },
    function gunzip(response, next) {
      var buffer = new Buffer(response.Body);
      zlib.gunzip(buffer, function(err, decoded) {
        next(err, decoded && decoded.toString());
      });
    },
    function doSomething(data, next) {
      doWork(data);
      context.done();
    }
  ], function(err) {
    if(err){
      console.log(err);
      throw err;
    }
  });
};

exports.handler = function(evet, context) {
  var record = event.Records[0];
  if(record.kinesis) {
    exports.kinesisHandler(event.Records, context);
  } else if(record.s3) {
    exports.s3Handler(record, context);
  }
};
