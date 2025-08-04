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

// Add this below your router.get('/', ...) route

router.post('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'secretkey');
    const userId = decoded.id;
    const { postId, category } = req.body;

    if (!postId || !category) {
      return res.status(400).json({ error: 'Missing postId or category' });
    }

    // Check if already saved (prevent duplicates)
    const existing = await Closet.findOne({ userId, postId });
    if (existing) {
      existing.category = category;
      await existing.save();
      return res.json({ message: 'Closet entry updated' });
    }

    const newEntry = new Closet({
      userId,
      postId,
      category
    });

    await newEntry.save();
    res.status(201).json({ message: 'Saved to closet!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save to closet' });
  }
});


module.exports = router;
