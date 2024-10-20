const express = require('express');
const { 
    getUserStatistics, 
    getUserRegistrationByMonth, 
    getProductCountByCategory, 
    getTop5SellingProducts, 
    getLowStockProducts, 
    getOrderByStatus, 
    getRevenueByMonth, 
    getTopCustomers, 
} = require('../controllers/statisticsController');

const router = express.Router();

// Định nghĩa route để lấy thống kê người dùng
router.get('/users/active', getUserStatistics);
router.get('/users/registration-by-month', getUserRegistrationByMonth);
router.get('/users/top', getTopCustomers);
router.get('/products/category-count', getProductCountByCategory);
router.get('/products/top-selling-products', getTop5SellingProducts);
router.get('/products/low-stock', getLowStockProducts);
router.get('/orders/status', getOrderByStatus);
router.get('/revenue-by-month', getRevenueByMonth);

module.exports = router;
