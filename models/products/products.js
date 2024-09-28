const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  // category: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  size: { type: [String] },
  color: { type: [String] },
  stock: { type: Number, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false }, // Thêm trường isDeleted
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
