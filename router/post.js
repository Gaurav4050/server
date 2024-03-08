const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, postsController.getPosts);

module.exports = router;
