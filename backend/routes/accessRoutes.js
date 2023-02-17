const express = require('express');
const router = express.Router();
const { grantAccess, getAccessForTopic, removeAccess, getUserAccesses } = require('../controllers/accessController');
const { protect } = require('../middleware/authMiddleware');

router.post('/grant', grantAccess);
router.post('/get', getAccessForTopic);
router.post('/remove', removeAccess);
router.post('/me', getUserAccesses);

module.exports = router;
