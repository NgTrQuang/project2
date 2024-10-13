const express = require('express');
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProductsCurrent,
  getProductsByCategory,
  getProductById,
  getProductByIdCurrent,
  updateProduct,
//   deleteProduct,
  sofeDeleteProduct
} = require('../controllers/productController');

// Route thêm sản phẩm mới
router.post('/', addProduct);

// Route lấy tất cả sản phẩm
router.get('/', getProducts);
// Route lấy tất cả sản phẩm hiện tại
router.get('/current', getProductsCurrent);
// Route lấy sản phẩm theo thể loại ID
router.get('/category', getProductsByCategory);

// Route lấy chi tiết sản phẩm theo ID
router.get('/:id', getProductById);
// Route lấy chi tiết sản phẩm theo ID hiện tại (chưa bị xóa)
router.get('/current/:id', getProductByIdCurrent);

// Route cập nhật sản phẩm theo ID
router.put('/:id', updateProduct);

// // Route xóa sản phẩm theo ID
// router.delete('/:id', deleteProduct);

// Route xóa mềm sản phẩm theo ID
router.delete('/:id', sofeDeleteProduct);

module.exports = router;
