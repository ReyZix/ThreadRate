const express = require('express');
const jwt = require('jsonwebtoken');
const Closet = require('../models/Closet'); // your Closet model
const Post = require('../models/Post');     // your Post model

const router = express.Router();

// Get current user's closet
router.get('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, 'secretkey');
    const userId = decoded.id;

    const entries = await Closet.find({ userId }).populate('postId');
    const formatted = entries.map(entry => ({
      _id: entry._id,
      category: entry.category,
      post: {
        title: entry.postId.title,
        imageUrl: entry.postId.imageUrl,
        description: entry.postId.description
      }
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get closet items' });
  }
});

module.exports = router;
