const paypal = require('@paypal/checkout-server-sdk');
const paypalClient = require('../config/paypalConfig');
const Order = require('../models/orders');
const Payment = require('../models/payments');
const Product = require('../models/products');
const Cart = require('../models/Carts');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
// const sendOrderConfirmationEmail = require('../utils/emailService'); // Module gửi email

const capturePayment = async (req, res) => {
    const { token } = req.params;
    console.log('Token từ URL:', token); // Kiểm tra giá trị token

    try {
        // Đầu tiên, tìm Payment bằng transactionId
        const payment = await Payment.findOne({ transactionId: token });
        console.log(payment);

        // Sau đó, nếu tìm thấy Payment, tìm Order có liên kết với Payment đó
        if (payment && payment.status === 'Đã thanh toán') {
            console.log('Đơn hàng đã được xử lý trước đó.');
            return res.status(200).json({ message: 'Đơn hàng đã xác thực capture' });
        } else {
            console.log("Không tìm thấy phương thúc transactionId.");
        }   

        // Tạo yêu cầu để xác nhận thanh toán
        const request = new paypal.orders.OrdersCaptureRequest(token);
        request.requestBody({}); // Nếu cần thêm thông tin vào body

        // Gọi phương thức capture đơn hàng
        const response = await paypalClient.execute(request);
        console.log('PayPal Capture Response:', response.result);
        // Cập nhật trạng thái đơn hàng
        if (response.result.status === 'COMPLETED') {
            payment.status = 'Đã thanh toán'; // Cập nhật trạng thái thanh toán
            await payment.save(); // Lưu thay đổi
            
            // Giảm số lượng sản phẩm trong kho

            const order = await Order.findOne({payment: payment._id}).populate('payment');
            // Giảm số lượng sản phẩm trong kho
            for (const item of order.items) {
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
                { user: order.user }, // Tìm giỏ hàng theo người dùng
                { $pull: { products: { _id: { $in: order.items.map(item => item._id) } } } } // Chỉnh sửa từ items sang products
            );
            // Gửi email xác nhận đơn hàng
            await sendOrderConfirmationEmail(order); 

            res.status(200).json({ message: 'Payment successful', capture: response.result });
        } else {
            res.status(400).json({ message: 'Order capture failed', details: response.result });
        }
    } catch (error) {
        console.error('Error capturing PayPal order:', error);
        res.status(500).json({ message: 'Error capturing PayPal order' });
    }
};

module.exports = { capturePayment };
