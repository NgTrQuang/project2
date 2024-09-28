const express = require('express');
const {register, login, logout } = require('../controllers/authController');
const authenticateToken = require('../middelware/authMiddleware');
const validateRegister = require('../middelware/validateRegister');

const router = express.Router();

// Route đăng ký
router.post('/register', validateRegister, register);

// Route đăng nhập
router.post('/login', login);

// Route đăng xuất
router.post('/logout', logout);

// Một route yêu cầu đăng nhập
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to your profile', user: req.user });
});

module.exports = router;
