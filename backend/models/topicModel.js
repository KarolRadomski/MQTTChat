const mongoose = require('mongoose');

const topicsSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a firstname'],
  },
  mqttTopic: {
    type: String,
    required: [true, 'Please generate topic'],
  },
  users: {
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model('Topic', topicsSchema);
