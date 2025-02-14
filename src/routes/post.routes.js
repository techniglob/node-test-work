// src/routes/post.routes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth.middleware');
const { 
    getAllPosts, 
    getPostById, 
    createPost, 
    updatePost, 
    deletePost 
} = require('../controllers/post.controller');
/* console.log(getAllPosts);
return; */

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);

module.exports = router;