const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, getName } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/all', getAllUsers);
router.get('/name', getName);

module.exports = router;
