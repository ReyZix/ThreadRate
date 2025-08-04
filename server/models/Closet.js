const mongoose = require('mongoose');

const ClosetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  category: {
    type: String,
    enum: ['to-wear', 'current-favorite', 'past-favorite'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ClosetEntry', ClosetSchema);
