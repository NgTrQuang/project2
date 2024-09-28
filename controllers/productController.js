const Product = require('../models/products/products');

// Thêm sản phẩm mới
const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add product', error });
  }
};

// Lấy tất cả sản phẩm
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

// Lấy tất cả sản phẩm chưa bị xóa
const getProductsCurrent = async (req, res) => {
    try {
      const products = await Product.find({ isDeleted: false });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch products', error });
    }
};

// Lấy chi tiết một sản phẩm
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
};

// Lấy chi tiết một sản phẩm chưa bị xóa
const getProductByIdCurrent = async (req, res) => {
    try {
      const product = await Product.findOne({ _id: req.params.id, isDeleted: false });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch product', error });
    }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product', error });
  }
};

// Xóa sản phẩm
// const deleteProduct = async (req, res) => {
//   try {
//     const deletedProduct = await Product.findByIdAndDelete(req.params.id);
//     if (!deletedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete product', error });
//   }
// };

const sofeDeleteProduct = async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true, updatedAt: Date.now() },
        { new: true }
      );
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product soft deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to soft delete product', error });
    }
};

module.exports = {
  addProduct,
  getProducts,
  getProductsCurrent,
  getProductById,
  getProductByIdCurrent,
  updateProduct,
//   deleteProduct,
  sofeDeleteProduct,
};
