router.post('/:postId/rate', async (req, res) => {
  const { value } = req.body;
  const userId = req.user.id; // Make sure you have authentication middleware

  if (value < 0 || value > 5) return res.status(400).json({ error: 'Invalid rating' });

  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const existingRating = post.ratings.find(r => r.userId.toString() === userId);
  if (existingRating) {
    existingRating.value = value;
  } else {
    post.ratings.push({ userId, value });
  }

  await post.save();
  res.json({ message: 'Rating submitted successfully' });
});
