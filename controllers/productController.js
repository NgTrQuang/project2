const { default: mongoose } = require('mongoose');
const Product = require('../models/products');
const Category = require('../models/Categories');

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
    const productsWithCategory = await Promise.all(
      products.map(async (product) => {
        const category = await Category.findById(product.category); //{ _id: { $in: product.categories } }
        return {
          ...product._doc,  // Spread nội dung của product
          category,         // Thêm thông tin category đã lấy
        };
      })
    );
    res.status(200).json(productsWithCategory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

// Lấy tất cả sản phẩm chưa bị xóa
const getProductsCurrent = async (req, res) => {
    try {
      const products = await Product.find({ isDeleted: false });
      const productsWithCategory = await Promise.all(
        products.map(async (product) => {
          const category = await Category.findById(product.category); //{ _id: { $in: product.categories } }
          return {
            ...product._doc,  // Spread nội dung của product
            category,         // Thêm thông tin category đã lấy
          };
        })
      );
      res.status(200).json(productsWithCategory);
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

    const category = await Category.findById(product.category);
    const productWithCategory = {
      ...product._doc, // Spread nội dung của product
      category,        // Thêm thông tin category
    };
    res.status(200).json(productWithCategory);
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
      const category = await Category.findById(product.category);
      const productWithCategory = {
        ...product._doc, // Spread nội dung của product
        category,        // Thêm thông tin category
      };

      res.status(200).json(productWithCategory);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch product', error });
    }
};

// Lấy sản phẩm theo thể loại
const getProductsByCategory = async (req, res) => {
  try {
    const category= req.query.category; // Lấy thể loại từ query parameter
    console.log('Category ID:', category);
    console.log('Is Valid ID:', mongoose.Types.ObjectId.isValid(category));

    if (!category) {
      return res.status(400).json({ message: 'Vui lòng cung cấp thể loại sản phẩm' });
    }

    // Tìm sản phẩm theo category_id
    const products = await Product.find({ 
      category: category,
      isDeleted: false // Chỉ lấy các sản phẩm không bị xóa 
    });

    console.log('Products:', products);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong thể loại này' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
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
      const deletedProduct = await Product.findById(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { isDeleted: !deletedProduct.isDeleted, updatedAt: Date.now() },
        { new: true }
      );

      res.status(200).json({ message: 'Product soft deleted successfully', product: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: 'Failed to soft delete product', error });
    }
};

// const getProductsByPage = async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const searchTerm = req.query.search || ''; // Lọc theo từ khóa tìm kiếm

//   const skip = (page - 1) * limit;

//   try {
//     // Áp dụng tìm kiếm và phân trang
//     const query = searchTerm ? { name: new RegExp(searchTerm, 'i') } : {};
    
//     const products = await Product.find(query)
//       .skip(skip)
//       .limit(limit);
    
//     const totalProducts = await Product.countDocuments(query);

//     res.json({
//       products,
//       totalPages: Math.ceil(totalProducts / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Lỗi server khi lấy danh sách sản phẩm.' });
//   }
// };

module.exports = {
  addProduct,
  getProducts,
  getProductsCurrent,
  getProductsByCategory,
  // getProductsByPage,
  getProductById,
  getProductByIdCurrent,
  updateProduct,
//   deleteProduct,
  sofeDeleteProduct,
};
