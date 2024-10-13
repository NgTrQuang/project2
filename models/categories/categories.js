const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false }, // Thêm trường isDeleted
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;