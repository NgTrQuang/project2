const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartItem } = require('../controllers/cartController');

router.get('/:userId', getCart);
// Định tuyến cho API thêm vào giỏ hàng
router.post('/', addToCart);

router.delete('/:userId/product/:cartId', removeFromCart);

router.put('/update', updateCartItem);

module.exports = router;
