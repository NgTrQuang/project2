const express = require('express');
const { createOrder, getUserOrders } = require('../controllers/orderController');
const authMiddleware = require('../middelware/authMiddleware'); // Middleware xác thực người dùng

const router = express.Router();

// Route cho việc tạo đơn hàng
router.post('/', createOrder);
router.get('/user/:userId', authMiddleware, getUserOrders);

module.exports = router;
