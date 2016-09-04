var gcloud = require('google-cloud');
var log = require('nodeutil').simplelog;
var util = require('util');

var pubsub = gcloud.pubsub({
  projectId: process.env.GCP_PROJECT_ID,
//  keyFilename: process.env.GCP_KEY_PATH
});

function pullMessages (subscriptionName, callback) {
  if (!subscriptionName) {
    return callback(new Error('"subscriptionName" is required!'));
  }

  var subscription = pubsub.subscription(subscriptionName);
  var options = {
    // Limit the amount of messages pulled.
    maxResults: 100,
    // If set, the system will respond immediately. Otherwise, wait until
    // new messages are available. Returns if timeout is reached.
    returnImmediately: true 
  };
  // Pull any messages on the subscription
  subscription.pull(options, function (err, messages) {
    if (err) {
      return callback(err);
    }
    // Do something for each message
    messages.forEach(handleMessage);

    console.log('Pulled %d messages!', messages.length);

    // Acknowledge messages
    var subscription = pubsub.subscription(subscriptionName);

    if(messages && messages.length > 0)
    subscription.ack(messages.map(function (message) {
      return message.ackId;
    }), function (err) {
      if (err) {
        return callback(err);
      }

      console.log('Acked %d messages!', messages.length);
      return callback(null, messages);
    });
  });
}

function handleMessage (message) {
  console.log('received message: ' + message.data);
}

var cnt = 10;
function doit(){
  cnt--;
  var ts = new Date().getTime();
  pullMessages('sub001', function(err, subscription) {
		if(err) log.error('subscribe error:', err);
		log.info('subscription:', subscription);
    log.info('[%s]Cost:%s\n', cnt, new Date().getTime() - ts);
		if(cnt >0) doit();
  });
}

doit();

