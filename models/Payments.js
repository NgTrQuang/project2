const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  method: { type: String, enum: ['COD', 'PayPal'], required: true },
  status: { type: String, enum: ['Chưa thanh toán', 'Đã thanh toán'], default: 'Chưa thanh toán' },
  amount: { type: Number, required: true }, // Tổng số tiền thanh toán
  transactionId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
