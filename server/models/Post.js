const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: { type: String, required: true },
  title: String,
  description: String,
  imageUrl: String,
  ratings: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        value: { type: Number, min: 0, max: 5 },
      }
    ],
    default: []
  }
}, { timestamps: true });
postSchema.index({ userId: 1, createdAt: -1 }); // Index for faster queries by user and creation date

module.exports = mongoose.model('Post', postSchema);
// server/models/Post.js