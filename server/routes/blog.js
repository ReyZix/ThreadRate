const express = require('express');
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const User = require('../models/User');

const router = express.Router();

// Middleware: Authenticate JWT and attach user info to request
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

// POST /api/blogs — Create a blog post
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;

    const blog = new Blog({
      title,
      content,
      isPublic,
      userId: req.user.id,
      username: req.user.username // embed username at creation
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// GET /api/blogs/public — Public blogs from all users
router.get('/public', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublic: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch public blogs' });
  }
});

// GET /api/blogs/mine — Blogs by the logged-in user
router.get('/mine', authenticate, async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your blogs' });
  }
});

module.exports = router;
