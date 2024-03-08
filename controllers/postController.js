const Post = require('../models/Post');

exports.getPosts = async (req, res) => {
  try {
    // Fetch posts data from database (implement pagination if needed)
    const posts = await Post.find().exec();
    res.json({ success: true, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
