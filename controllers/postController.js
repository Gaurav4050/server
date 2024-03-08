const Post = require('../models/Post');

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const skip = (page - 1) * perPage;

    // Fetch posts data from database with pagination
    const posts = await Post.find().skip(skip).limit(perPage).exec();

    const totalPages = await Post.countDocuments();

    res.json({ success: true, posts , totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
