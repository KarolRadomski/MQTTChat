const mongoose = require('mongoose');
const accessSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  topicID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Topic',
  },
});
module.exports = mongoose.model('Access', accessSchema);
