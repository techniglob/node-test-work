// src/controllers/post.controller.js
const pool = require('../config/database');

const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [posts] = await pool.execute(
            `SELECT p.*, u.username as author_name, c.name as category_name 
             FROM posts p 
             JOIN users u ON p.author_id = u.id 
             JOIN categories c ON p.category_id = c.id 
             WHERE p.status = 'published' 
             ORDER BY p.created_at DESC 
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        const [count] = await pool.execute(
            "SELECT COUNT(*) as total1 FROM posts WHERE status = 'published'"
        );
        /* console.log(count[0]?.total);
    return;  */       
        res.status(200).json({
            status: 'success',
            data: posts,
            meta: {
                page,
                per_page: limit,
                total: count[0].total
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    getAllPosts
};