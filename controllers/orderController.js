const paypalClient = require('../config/paypalConfig');
const paypal = require('@paypal/checkout-server-sdk');
const Order = require('../models/orders/orders');
const Payment = require('../models/payments/payments');
const Product = require('../models/products/products');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

const createOrder = async (req, res) => {
  try {
    const { user, totalAmount, shippingAddress, paymentMethod, items } = req.body;

    // Tạo đơn hàng
    const order = new Order({
      user,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price, // Nếu cần, có thể truyền giá từ phía frontend hoặc tính toán lại ở backend
        color: item.color,
        size: item.size,
      })),
      totalAmount,
      shippingAddress,
      orderStatus: 'Chưa xử lý',
    });

    await order.save();

    // // Xóa các sản phẩm khỏi giỏ hàng (giả sử có model giỏ hàng)
    // await Cart.findOneAndUpdate(
    //   { user }, // Tìm giỏ hàng theo người dùng
    //   { $pull: { items: { product: { $in: items.map(item => item.productId) } } } }, // Xóa các sản phẩm đã mua khỏi giỏ
    //   { multi: true } // Cập nhật tất cả các mục trùng khớp
    // );

    if (paymentMethod === 'PayPal') {
      const request = new paypal.orders.OrdersCreateRequest();
      request.requestBody({
          intent: 'CAPTURE',
          purchase_units: [{
              amount: {
                  currency_code: 'USD',
                  value: (totalAmount / 23000).toFixed(2), // Chuyển đổi từ VND sang USD
              },
          }],
          application_context: {
            return_url: 'http://localhost:3001/checkout/success', // URL PayPal sẽ chuyển hướng đến sau khi thanh toán thành công
            cancel_url: 'http://localhost:3001/checkout/cancel',  // URL chuyển hướng nếu người dùng hủy bỏ thanh toán
        }
      });

      const response = await paypalClient.execute(request);

      // Lưu thông tin thanh toán vào database
      const payment = new Payment({
          order: order._id,
          method: paymentMethod,
          amount: totalAmount,
          status: 'Chưa thanh toán',
          transactionId: response.result.id // Lưu ID đơn hàng PayPal
      });

      await payment.save();

      // Cập nhật lại đơn hàng với thông tin thanh toán
      order.payment = payment._id;
      await order.save();

      // // Giảm số lượng sản phẩm trong kho
      // for (const item of items) {
      //     const product = await Product.findById(item.product);
      //     if (product) {
      //         product.stock = product.stock - item.quantity;
      //         await product.save();
      //     }
      // }

      res.status(201).json({ order, approvalUrl: response.result.links.find(link => link.rel === 'approve').href });
    } else {
      // Xử lý thanh toán cho phương thức COD
      const payment = new Payment({
          order: order._id,
          method: paymentMethod,
          amount: totalAmount,
          status: 'Chưa thanh toán',
      });

      await payment.save();

      // Cập nhật lại đơn hàng với thông tin thanh toán
      order.payment = payment._id;
      await order.save();

      // Giảm số lượng sản phẩm trong kho
      for (const item of items) {
          const product = await Product.findById(item.product);
          if (product) {
              product.stock = product.stock - item.quantity;
              await product.save();
          }
      }
      // Gọi hàm gửi email xác nhận đơn hàng
      await sendOrderConfirmationEmail(order);

      res.status(201).json(order);
    }
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách đơn hàng của người dùng
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ middleware xác thực
    const orders = await Order.find({ user: userId }).populate('items.product'); // Lấy các đơn hàng và điền thông tin sản phẩm

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Không có đơn hàng nào' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng' });
  }
};

module.exports = { 
  createOrder,
  getUserOrders, 
};
