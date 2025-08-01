const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: { type: String, required: true }, // Add this line
  title: String,
  description: String,
  imageUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
