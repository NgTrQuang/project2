const User = require('../models/users');
const Product = require('../models/products');
const Order = require('../models/orders');

// Controller để lấy thống kê người dùng
const getUserStatistics = async (req, res) => {
  try {
    // Tổng số người dùng
    const totalUsers = await User.countDocuments({});

    // Số người dùng đang hoạt động
    const activeUsers = await User.countDocuments({ isDisabled: false });

    // Số người dùng không hoạt động
    const inactiveUsers = await User.countDocuments({ isDisabled: true });

    // Trả về kết quả
    res.json({ totalUsers, activeUsers, inactiveUsers });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu thống kê người dùng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getUserRegistrationByMonth = async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();
      const statistics = await User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(`${currentYear}-01-01`),
              $lte: new Date(`${currentYear}-12-31`)
            }
          }
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
  
      res.json(statistics);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê đăng ký người dùng theo tháng:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
};  

const getProductCountByCategory = async (req, res) => {
    try {
      const statistics = await Product.aggregate([
        { $match: { isDeleted: false } }, // Chỉ thống kê sản phẩm chưa bị xóa
        {
          $lookup: {
            from: 'categories', // Tên collection Category trong MongoDB
            localField: 'category',
            foreignField: '_id',
            as: 'categoryDetails',
          },
        },
        {
          $unwind: '$categoryDetails', // Giải nén mảng categoryDetails để truy cập thông tin danh mục
        },
        {
          $group: {
            _id: "$categoryDetails.name", // Nhóm theo tên danh mục
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } } // Sắp xếp theo số lượng giảm dần
      ]).exec();
  
      res.json(statistics);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê sản phẩm theo danh mục:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
};
 
const getTop5SellingProducts = async (req, res) => {
    try {
      // Truy vấn các đơn hàng đã hoàn thành (hoặc trạng thái khác tùy yêu cầu)
      const orders = await Order.find({ orderStatus: 'Đã nhận hàng' }).populate('items.product');
      
      // Tạo một đối tượng để lưu trữ số lượng bán của từng sản phẩm
      const productSales = {};
  
      // Duyệt qua tất cả các đơn hàng để tính tổng số lượng bán cho từng sản phẩm
      orders.forEach(order => {
        order.items.forEach(item => {
          if (item.product && !item.product.isDeleted) {
            const productId = item.product._id.toString(); // Chuyển ObjectId thành chuỗi để dễ xử lý
            if (productSales[productId]) {
              productSales[productId] += item.quantity; // Cộng dồn số lượng bán cho sản phẩm
            } else {
              productSales[productId] = item.quantity;
            }
          }
        });
      });
  
      // Chuyển đối tượng thành mảng và sắp xếp theo số lượng bán
      const sortedProducts = Object.keys(productSales)
        .map(productId => ({
          productId: productId,
          sales: productSales[productId],
        }))
        .sort((a, b) => b.sales - a.sales); // Sắp xếp giảm dần theo số lượng bán
  
      // Lấy 5 sản phẩm bán chạy nhất
      const top5Products = sortedProducts.slice(0, 5);
  
      // Lấy thêm thông tin về sản phẩm từ Product model
      const top5ProductDetails = await Product.find({ 
        '_id': { $in: top5Products.map(item => item.productId) },
        isDeleted: false,
      });
  
      // Map lại kết quả để trả về tên sản phẩm và số lượng bán
      const result = top5Products.map(item => {
        const product = top5ProductDetails.find(prod => prod._id.toString() === item.productId);
        if (product) {
          return {
            productName: product.name,
            quantitySold: item.sales,
            price: product.price,
          };
        } else {
          return null; // Nếu sản phẩm không tìm thấy, bỏ qua nó
        }
    }).filter(item => item !== null);
  
      res.json(result);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê sản phẩm bán chạy:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
};

const getLowStockProducts = async (req, res) => {
    try {
      const threshold = 50;  // Ngưỡng tồn kho thấp, có thể điều chỉnh theo yêu cầu
      const products = await Product.aggregate([
        { $unwind: '$variants' }, // Tách mỗi variant thành một phần tử riêng biệt
        { $match: { 'variants.stock': { $lte: threshold } } }, // Lọc các variant có stock <= threshold
        { $project: { 
            name: 1,
            price: 1,
            category: 1,
            'variants.color': 1,
            'variants.size': 1,
            'variants.stock': 1,
            image: 1
          } 
        }
      ]);
  
      if (products.length === 0) {
        return res.status(404).json({ message: 'Không có sản phẩm nào có tồn kho thấp.' });
      }
  
      res.json(products);  // Trả về danh sách các sản phẩm có tồn kho thấp
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm tồn kho thấp:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
};

const getOrderByStatus = async (req, res) => {
    try {
      const orderStatusCount = await Order.aggregate([
        { 
          $group: {
            _id: "$orderStatus",    
            count: { $sum: 1 } 
          }
        }
      ]);
  
      res.status(200).json(orderStatusCount);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thống kê đơn hàng.', error });
    }
};

const getRevenueByMonth = async (req, res) => {
  try {
    const revenueByMonth = await Order.aggregate([
      {
        $match: {
          orderStatus: "Đã nhận hàng", 
        }
      },
      {
        $group: {
          _id: { 
            month: { $month: "$createdAt" },  
            year: { $year: "$createdAt" },    
          },
          totalRevenue: { $sum: "$totalAmount" } 
        }
      },
      { 
        $sort: { "_id.year": 1, "_id.month": 1 } 
      }
    ]);

    res.status(200).json(revenueByMonth);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thống kê doanh thu theo tháng.', error });
  }
};

const getTopCustomers = async (req, res) => {
  try {
    const year = new Date().getFullYear();

    const topCustomers = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
          orderStatus: "Đã nhận hàng", 
        }
      },
      {
        $group: {
          _id: '$user', 
          totalSpent: { $sum: '$totalAmount' }, 
          orderCount: { $sum: 1 }, 
        }
      },
      {
        $lookup: {
          from: 'users', 
          localField: '_id',
          foreignField: '_id',
          as: 'customerInfo',
        }
      },
      {
        $unwind: '$customerInfo' 
      },
      {
        $sort: { totalSpent: -1 }
      },
      {
        $limit: 3
      },
      {
        $project: {
          _id: 1,
          totalSpent: 1,
          orderCount: 1,
          'customerInfo.fullName': 1,
          'customerInfo.email': 1
        }
      }
    ]);

    res.status(200).json(topCustomers);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách khách hàng', error });
  }
};

module.exports = {
  getUserStatistics,
  getUserRegistrationByMonth,
  getProductCountByCategory,
  getTop5SellingProducts,
  getLowStockProducts,
  getOrderByStatus,
  getRevenueByMonth,
  getTopCustomers,
};
