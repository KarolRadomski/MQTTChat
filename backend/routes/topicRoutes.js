const express = require('express');
const router = express.Router();
const { createTopic, renameTopic, removeTopic, getTopic } = require('../controllers/topicController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', createTopic);
router.put('/rename', renameTopic);
router.post('/remove', removeTopic);
router.get('/getAll', getTopic);

module.exports = router;
