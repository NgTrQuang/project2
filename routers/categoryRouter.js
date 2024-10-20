const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');

// Lấy tất cả danh mục
router.get('/', getCategories);

// Thêm một danh mục mới
router.post('/', createCategory);

module.exports = router;
