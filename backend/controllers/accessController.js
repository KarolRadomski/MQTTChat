const asyncHandler = require('express-async-handler');
const Access = require('../models/accessModel');
const Topic = require('../models/topicModel');
const User = require('../models/userModel');

const getAccessForTopic = asyncHandler(async (req, res) => {
  const { topicID } = req.body;

  if (!topicID) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const accesses = await Access.find({
    topicID: { $eq: topicID },
  });

  if (accesses) {
    res.status(201).json({
      accesses,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user Data');
  }
});

// @desc    Grant access
// @route   POST /api/access/grant
// @access  Public
const grantAccess = asyncHandler(async (req, res) => {
  const { userID, topicID } = req.body;

  if (!userID && !topicID) {
    res.status(400);
    throw new Error('Please add all fields');
  }
  console.log(userID);
  //Check if both topic and user exists
  const userExists = await User.findById(userID);
  const topicExists = await Topic.findById(topicID);

  if (userExists && topicExists) {
    const access = await Access.create({
      userID: userID,
      topicID: topicID,
    });

    if (access) {
      res.status(201).json({
        _id: access.id,
        userID: access.userID,
        topicID: access.topicID,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user Data');
    }
  } else {
    res.status(400);
    throw new Error('Invalid data');
  }
});

// @desc    Remove access
// @route   POST /api/access/grant
// @access  Public
const removeAccess = asyncHandler(async (req, res) => {
  const { userID, topicID } = req.body;

  if (!userID && !topicID) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const removed = await Access.findOneAndDelete({
    $and: [
      {
        userID: {
          $eq: userID,
        },
      },
      {
        topicID: {
          $eq: topicID,
        },
      },
    ],
  });

  if (removed) {
    res.status(201).json({
      _id: removed.id,
      userID: removed.userID,
      topicID: removed.topicID,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user Data');
  }
});

// @desc    get user access
// @route   POST /api/access/my
// @access  Public
const getUserAccesses = asyncHandler(async (req, res) => {
  const { userID } = req.body;

  if (!userID) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const userAccessesRaw = await Access.find({
    userID: {
      $eq: userID,
    },
  });

  let topicsIDs = [];
  userAccessesRaw.forEach((access) => {
    topicsIDs.push(access.topicID);
  });

  const userAccesses = await Topic.find({
    _id: {
      $in: topicsIDs,
    },
  });

  // console.log(temp);

  if (userAccesses) {
    res.status(201).json({
      accesses: userAccesses,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user Data');
  }
});

module.exports = {
  getAccessForTopic,
  grantAccess,
  removeAccess,
  getUserAccesses,
};
