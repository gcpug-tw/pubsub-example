# Test of PubSub publish and pull data

This is a demo modify from PubSub document for message publish and pull from a pull subscriber for 10 times. It also record the time cost for each process.

## Prepare

### Create topic

```
gcloud alpha pubsub topics create my-topic
```

### Create subscriber

```
gcloud alpha pubsub subscriptions create sub001 --topic my-topic
```

## Code

* publish.js: for publish 10 messages to topic 'my-topic'
* pull.js: for pull 10 times from subscriber:'sub001'

## Run

### Run publisher

```
node publish.js
```

### Run puller

```
node pull.js
```
