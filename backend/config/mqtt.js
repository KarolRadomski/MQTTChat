const mqtt = require('mqtt');
const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');

const connectMQTT = () => {
  const options = {
    host: 'broker.hivemq.com',
    port: 8883,
    protocol: 'mqtts',
  };

  // initialize the MQTT client
  const client = mqtt.connect(options);

  // setup the callbacks
  client.on('connect', function () {
    console.log('Connected');
    client.subscribe('59WptC}CwzP{yd4W/#');
  });

  client.on(
    'message',
    asyncHandler(async (topic, message) => {
      // called each time a message is received
      // every message will be logged in database with authorID, topicID and value
      const messageObject = JSON.parse(message);
      try {
        await Message.create(messageObject);
      } catch (error) {
        console.log(error);
      }
    })
  );
};

module.exports = connectMQTT;

// required message format:

// {
//    "firstname": "Karol",
//    "lastname": "Radomski",
//    "authorID":"639afe70b4ad081670867384",
//    "topicID":"6391c2896dce50bb0616d779",
//    "value":"Testowa 'karol' wiadomość"
// }
