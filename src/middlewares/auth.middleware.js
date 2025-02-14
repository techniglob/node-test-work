// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ status: 'error', message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ status: 'error', message: 'Invalid token' });
    }
};

module.exports = { authenticateToken };