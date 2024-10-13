const mongoose = require('mongoose');
const Product = require('./models/products/products'); // Đường dẫn đến mô hình Product
const Category = require('./models/categories/categories'); // Đường dẫn đến mô hình Category

const updateProductCategories = async () => {
  try {
    // Kết nối đến cơ sở dữ liệu MongoDB
    await mongoose.connect('mongodb://localhost:27017/database1', {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    // Lấy tất cả các sản phẩm
    const products = await Product.find();

    // Duyệt qua từng sản phẩm
    for (const product of products) {

      const category = await Category.findOne({ products: product._id });

        if (category){
          product.category = category._id;
          await product.save();
          console.log("Đã cập nhật");
        }else{
          console.log("Không hợp lệ");
        }
      
      // // Kiểm tra xem category có phải là ObjectId không
      // if (product.category instanceof mongoose.Types.ObjectId) {
      //   // Gán một category mới nếu cần thiết
      //   const newCategoryId = new mongoose.Types.ObjectId('66f7c5b8d3de0bcc1cdbf6ef'); // ID mới cho category
      //   product.category = newCategoryId; // Cập nhật category
      //   await product.save();
      //   console.log(`Đã cập nhật sản phẩm: ${product.name} với category ID mới: ${newCategoryId}`);
      // } else {
      //   console.log(`Sản phẩm: ${product.name} không có category hợp lệ.`);
      // }
    }

    console.log('Cập nhật hoàn tất!');
  } catch (error) {
    console.error('Lỗi:', error.message);
  } finally {
    // Đóng kết nối
    mongoose.connection.close();
  }
};

updateProductCategories();
