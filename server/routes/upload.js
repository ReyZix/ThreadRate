const express = require('express');
const Post = require('../models/Post.js'); // Your Mongoose post schema
const router = express.Router();

// Create post with Cloudinary image URL
router.post('/upload', async (req, res) => {
  const { userId, title, description, imageUrl } = req.body;

  if (!imageUrl || !title || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const post = new Post({
      userId,
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
