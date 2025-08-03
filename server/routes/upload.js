const express = require('express');
const Post = require('../models/Post.js');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

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

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Rate a post
router.post('/posts/:postId/rate', async (req, res) => {
  try {
    const { value } = req.body;
    const { postId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, 'secretkey');
    const userId = decoded.id;

    if (value < 0 || value > 5) return res.status(400).json({ error: 'Invalid rating' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const existingRating = post.ratings.find(r => r.userId.toString() === userId);
    if (existingRating) {
      existingRating.value = value;
    } else {
      post.ratings.push({ userId, value });
    }

    await post.save();
    res.json({ message: 'Rating submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

module.exports = router;
