// Import model Category
const Category = require('../models/Categories');

// Lấy tất cả danh mục
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();  // Lấy tất cả danh mục từ cơ sở dữ liệu
    res.status(200).json(categories);  // Trả về danh sách danh mục dưới dạng JSON
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error });
  }
};

// Thêm một danh mục mới
const createCategory = async (req, res) => {
    const { name, description } = req.body;
  
    try {
      const newCategory = new Category({ name, description });  // Tạo danh mục mới
      await newCategory.save();  // Lưu vào cơ sở dữ liệu
      res.status(201).json(newCategory);  // Trả về danh mục mới dưới dạng JSON
    } catch (error) {
      res.status(500).json({ message: 'Failed to create category', error });
    }
  };

module.exports = { getCategories, createCategory };
