var gcloud = require('google-cloud');
var log = require('nodeutil').simplelog;
var util = require('util');

var pubsub = gcloud.pubsub({
  projectId: process.env.GCP_PROJECT_ID,
//  keyFilename: process.env.GCP_KEY_PATH
});

function publishMessage (topicName, message, callback) {
  if (!topicName) {
    return callback(new Error('"topicName" is required!'));
  } else if (!message) {
  }
  try {
    message = JSON.parse(message);
  } catch (err) {
    return callback(new Error('"message" must be a valid JSON string!'));
  }

  // Grab a reference to an existing topic
  var topic = pubsub.topic(topicName);

  // Publish a message to the topic
  topic.publish(message, function (err, messageIds) {
    if (err) {
      return callback(err);
    }
    log.info('Published %d messages!\n', messageIds.length);
    return callback(null, messageIds);
  });
}

var cnt = 10;
function doit() {
  var ts = new Date().getTime();
	cnt --;
	publishMessage('my-topic', util.format('{"data":"message at time:%s"}', new Date()), function(err, msgid) {
		if(err) log.error('publish error:', err);
		log.info('msgid:', msgid);
    log.info('Cost: %s\n', new Date().getTime() - ts);
		if(cnt >0) doit();
	});
}

//start job
doit();
