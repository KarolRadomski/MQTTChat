const mongoose = require('mongoose');
const messageSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    authorID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    topicID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Topic',
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('Message', messageSchema);
