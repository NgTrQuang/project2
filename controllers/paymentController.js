const paypal = require('@paypal/checkout-server-sdk');
const paypalClient = require('../config/paypalConfig');
const Order = require('../models/orders/orders');
const Payment = require('../models/payments/payments');
const Product = require('../models/products/products');
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
            for (const item of order.items) {
                const product = await Product.findById(item.product);
                if (product) {
                    if (product.stock >= item.quantity) {
                        product.stock -= item.quantity; // Trừ số lượng trong kho
                        await product.save();
                    } else {
                        console.error(`Số lượng sản phẩm không đủ: ${product.name}`);
                        return res.status(400).json({ message: `Không đủ sản phẩm: ${product.name}` });
                    }
                }else {
                    console.error('Không tìm thấy sản phẩm:', item.product);
                    return res.status(404).json({ message: `Sản phẩm không tồn tại: ${item.product}` });
                }
            }

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
