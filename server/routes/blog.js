const express = require('express');
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const User = require('../models/User');

const router = express.Router();

// Middleware for token-based auth
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = { id: user._id, username: user.username };
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Create a blog
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const blog = new Blog({
      title,
      content,
      isPublic,
      userId: req.user.id,
      username: req.user.username
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// Get all public blogs
router.get('/public', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublic: true });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch public blogs' });
  }
});

// Get blogs by current user
router.get('/mine', authenticate, async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.user.id });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your blogs' });
  }
});

module.exports = router;
