const asyncHandler = require('express-async-handler');
const Topic = require('../models/topicModel');

// @desc    Create new Topic
// @route   POST /api/topic/create
// @access  Public
const createTopic = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  //Check if topic exists
  const topicExists = await Topic.findOne({ name });

  if (topicExists) {
    res.status(400);
    throw new Error('Topic already exists');
  }
  let preparedName = name.replace(/\s/g, '');
  //Create topic
  const topic = await Topic.create({
    name,
    mqttTopic: `59WptC}CwzP{yd4W/${preparedName}`,
  });

  if (topic) {
    res.status(201).json({
      _id: topic.id,
      name: topic.name,
      mqttTopic: topic.mqttTopic,
      users: topic.users,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user Data');
  }
});

// @desc    Rename Topic
// @route   PUT /api/topic/rename
// @access  Public
const renameTopic = asyncHandler(async (req, res) => {
  const { id, name } = req.body;

  if (!name || !id) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  //Check if topic exists
  const topicExists = await Topic.findById(id);

  if (topicExists) {
    //rename topic
    let preparedName = name.replace(/\s/g, '');
    const topic = await Topic.findByIdAndUpdate(
      id,
      {
        name,
        mqttTopic: `company/${preparedName}`,
      },
      { returnDocument: 'after' }
    );

    // // response after update
    if (topic) {
      res.status(201).json({
        _id: topic.id,
        name: topic.name,
        mqttTopic: topic.mqttTopic,
        users: topic.users,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user Data');
    }
  } else {
    res.status(400);
    throw new Error('There is no such topic');
  }
});
// @desc    Remove Topic
// @route   POST /api/topic/remove
// @access  Public
const removeTopic = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const topic = await Topic.findByIdAndDelete(id, { returnDocument: 'before' });

  // // response after update
  if (topic) {
    res.status(201).json({
      _id: topic.id,
      name: topic.name,
      mqttTopic: topic.mqttTopic,
      users: topic.users,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user Data');
  }
});

// @desc    Get all topics with assingment
// @route   GET /api/topic/create
// @access  Public
const getTopic = asyncHandler(async (req, res) => {
  //Check if topic exists
  const topics = await Topic.find();

  if (topics) {
    res.status(201).json({
      topics,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user Data');
  }
});

module.exports = {
  createTopic,
  renameTopic,
  removeTopic,
  getTopic,
};
