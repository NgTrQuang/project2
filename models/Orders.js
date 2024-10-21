const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalAmount: { type: Number, required: true }, // Tổng giá trị đơn hàng
  shippingAddress: { type: String, required: true },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }, // Liên kết tới thanh toán
  orderStatus: {
    type: String,
    enum: ['Đang xử lý', 'Đã xác nhận', 'Đang giao hàng', 'Đã nhận hàng', 'Đã hủy', 'Lỗi sản phẩm'],
    default: 'Đang xử lý',
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // Lưu giá của sản phẩm tại thời điểm đặt hàng
      color: { type: String, default: '' },  // Lưu màu sắc người dùng chọn
      size: { type: String, default: '' },   // Lưu size người dùng chọn
    },
  ],
  errorTime: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
