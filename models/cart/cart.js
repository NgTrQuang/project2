const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      color: { type: String, default: '' },  // Lưu màu sắc người dùng chọn
      size: { type: String, default: '' },   // Lưu size người dùng chọn
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
