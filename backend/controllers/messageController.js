const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');

const getMessagesForTopic = asyncHandler(async (req, res) => {
  const { topicID } = req.body;

  if (!topicID) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const messages = await Message.find({
    topicID: { $eq: topicID },
  }).sort({ date: 1 });

  if (messages) {
    res.status(201).json({
      messages,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user Data');
  }
});

module.exports = {
  getMessagesForTopic,
};
