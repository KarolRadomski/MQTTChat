const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Register new User
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  //Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create user
  const user = await User.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isAdmin: user.isAdmin,
      // token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user Data');
  }
});
// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isAdmin: user.isAdmin,
      // token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});
// @desc    Get all users
// @route   GET /api/users/all
// @access  Public
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    isAdmin: {
      $eq: false,
    },
  }).select(['_id', 'firstname', 'lastname']);

  if (users) {
    res.json({
      users,
    });
  }
});

// @desc    Get user name by id
// @route   GET /api/users/name
// @access  Public
const getName = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const user = await User.findById(id);

  // // response after update
  if (user) {
    res.status(201).json({
      firstname: user.firstname,
      lastname: user.lastname,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user id');
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getName,
};
