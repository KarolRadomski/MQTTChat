const express = require('express');
const router = express.Router();
const { getMessagesForTopic } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/get', getMessagesForTopic);

module.exports = router;
