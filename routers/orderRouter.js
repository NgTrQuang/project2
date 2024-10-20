const express = require('express');
const { 
    createOrder, 
    getUserOrders, 
    getAllOrders, 
    OrderStatusUpdate, 
    OrderCanceled } = require('../controllers/orderController');
const authMiddleware = require('../middelware/authMiddleware'); // Middleware xác thực người dùng

const router = express.Router();

// Route cho việc tạo đơn hàng
router.post('/', createOrder);
router.get('/user/:userId', authMiddleware, getUserOrders);
router.get('/all', authMiddleware, getAllOrders);
router.put('/update-status/:id', authMiddleware, OrderStatusUpdate);
router.put('/cancel-error/:id', authMiddleware, OrderCanceled);
 
module.exports = router;
