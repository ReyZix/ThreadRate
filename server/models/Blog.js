const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  isPublic: Boolean,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  username: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
