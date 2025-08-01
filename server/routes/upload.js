const express = require('express');
const Post = require('../models/Post.js'); // Your Mongoose post schema
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Needed to get username from ID


// Create post with Cloudinary image URL
router.post('/upload', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { title, description, imageUrl } = req.body;
    if (!imageUrl || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const post = new Post({
      userId: user._id,
      username: user.username,
      title,
      description,
      imageUrl,
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});



router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // newest first
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});


module.exports = router;
