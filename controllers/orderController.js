const paypalClient = require('../config/paypalConfig');
const paypal = require('@paypal/checkout-server-sdk');
const Order = require('../models/orders');
const Payment = require('../models/payments');
const Product = require('../models/products');
const Cart = require('../models/Carts');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
const express = require('express');
const router = express.Router();

const createOrder = async (req, res) => {
  try {
    const { user, totalAmount, shippingAddress, paymentMethod, items } = req.body;

    // Tạo đơn hàng
    const order = new Order({
      user,
      items: items.map(item => ({
        _id: item._id,
        product: item.product,
        quantity: item.quantity,
        price: item.price, // Nếu cần, có thể truyền giá từ phía frontend hoặc tính toán lại ở backend
        color: item.color,
        size: item.size,
      })),
      totalAmount,
      shippingAddress,
      orderStatus: 'Đang xử lý',
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

      // // Xóa các sản phẩm khỏi giỏ hàng
      // await Cart.findOneAndUpdate(
      //   { user }, // Tìm giỏ hàng theo người dùng
      //   { $pull: { products: { product: { $in: items.map(item => item.product) } } } } // Chỉnh sửa từ items sang products
      // );

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
            const variant = product.variants.find(v => v.color === item.color && v.size === item.size);
            if (variant) {
                if (variant.stock >= item.quantity) {
                    variant.stock -= item.quantity; // Giảm số lượng cho biến thể sản phẩm
                    await product.save();
                } else {
                    console.error(`Số lượng sản phẩm không đủ: ${product.name}`);
                    return res.status(400).json({ message: `Không đủ sản phẩm: ${product.name} màu ${item.color}, kích cỡ ${item.size}` });
                }
            } else {
                console.error(`Không tìm thấy biến thể cho sản phẩm: ${product.name} màu ${item.color}, kích cỡ ${item.size}`);
                return res.status(404).json({ message: `Biến thể không tồn tại cho sản phẩm: ${product.name}` });
            }
        } else {
            console.error('Không tìm thấy sản phẩm:', item.product);
            return res.status(404).json({ message: `Sản phẩm không tồn tại: ${item.product}` });
        }
      }

      // Xóa các sản phẩm khỏi giỏ hàng
      await Cart.findOneAndUpdate(
        { user }, // Tìm giỏ hàng theo người dùng
        { $pull: { products: { _id: { $in: items.map(item => item._id) } } } } // Chỉnh sửa từ items sang products
      );
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
    const orders = await Order.find({ user: userId }).populate('payment items.product'); // Lấy các đơn hàng và điền thông tin sản phẩm

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Không có đơn hàng nào' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng' });
  }
};

// Lấy danh sách tất cả các đơn hàng
const getAllOrders = async (req, res) => {
  try {
    // const { userId } = req.params; // Lấy userId từ middleware xác thực
    const orders = await Order.find().populate('payment items.product'); // Lấy các đơn hàng và điền thông tin sản phẩm

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Không có đơn hàng nào' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng' });
  }
};

// Cập nhật đơn hàng
const OrderStatusUpdate = async (req, res) => {
  try {
    // const { userId } = req.params; // Lấy userId từ middleware xác thực
    const order = await Order.findById(req.params.id).populate('payment items.product');
    console.log(order);
    if (!order || order.length === 0) {
      return res.status(404).json({ message: 'Không có đơn hàng nào' });
    }
    if (order.orderStatus === 'Đang xử lý'){
      order.orderStatus = 'Đã xác nhận';
    } else if (order.orderStatus === 'Đã xác nhận'){
      order.orderStatus = 'Đang giao hàng';
    } else if (order.orderStatus === 'Đang giao hàng'){
      order.orderStatus = 'Đã nhận hàng';
      order.errorTime = new Date();
      if(order.payment.status === 'Chưa thanh toán'){
        const payment = await Payment.findById(order.payment._id);
        payment.status = 'Đã thanh toán';
        await payment.save();
        order.payment = payment;  // Đảm bảo lưu lại đối tượng đã cập nhật
      }
    }
    
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hủy đơn hàng
const OrderCanceled = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('payment items.product');
    if (!order || order.length === 0) {
      return res.status(404).json({ message: 'Không có đơn hàng nào' });
    }

    if(order.payment.status === 'Đã thanh toán'){
      if (order.orderStatus === 'Đã nhận hàng' && order.errorTime){
        const timeDifference = new Date() - new Date (order.errorTime);
        if (timeDifference <= 24 * 60 * 60 * 1000) { // Nếu quá 24 giờ
          order.orderStatus = 'Lỗi sản phẩm';
        } else
        order.errorTime = new Date();
      } else if (order.orderStatus === 'Lỗi sản phẩm' ){  
        order.orderStatus = 'Đã xác nhận';
      }
    } 
    if (order.payment.status === 'Chưa thanh toán'){
      if (order.orderStatus === 'Đang xử lý' || (order.orderStatus === 'Đã xác nhận' && !order.errorTime)){
        order.orderStatus = 'Đã hủy';
        //Cập nhật số lượng hoàn lại kho
        for (const item of order.items) {
          const product = await Product.findById(item.product);
          if (product) {
            const variant = product.variants.find(v => v.color === item.color && v.size === item.size);
            if (variant) {    
              variant.stock += item.quantity; // tăng lại số lượng cho biến thể sản phẩm
              await product.save();  
            } else {
              console.error(`Không tìm thấy biến thể cho sản phẩm: ${product.name} màu ${item.color}, kích cỡ ${item.size}`);
              return res.status(404).json({ message: `Biến thể không tồn tại cho sản phẩm: ${product.name}` });
            }
          } else {
            console.error('Không tìm thấy sản phẩm:', item.product);
            return res.status(404).json({ message: `Sản phẩm không tồn tại: ${item.product}` });
          }
        }
      }
    }
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createOrder,
  getUserOrders, 
  getAllOrders,
  OrderStatusUpdate,
  OrderCanceled,
};
