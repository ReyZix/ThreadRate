const mongoose = require('mongoose');
const Post = require('./models/Post'); // ✅ correct path based on your folder

mongoose.connect('mongodb://127.0.0.1:27017/threadrate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function patchPosts() {
  try {
    const posts = await Post.find({ ratings: { $exists: false } });
    for (const post of posts) {
      post.ratings = [];
      await post.save();
      console.log(`Updated post ${post._id}`);
    }
  } catch (err) {
    console.error('Error patching posts:', err);
  } finally {
    mongoose.disconnect();
  }
}

patchPosts();
