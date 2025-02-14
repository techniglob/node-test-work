const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

// GET /api/posts
router.get('/', postController.getAllPosts);

// GET /api/posts/:id
// router.get('/:id', postController.getPost);

module.exports = router;