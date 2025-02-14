
// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const register = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password_hash, first_name, last_name, role_id) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, firstName, lastName, 5]
        );

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [users] = await pool.execute(
            'SELECT id, username, password_hash, role_id FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            status: 'success',
            data: { token, username: user.username }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { register, login };
