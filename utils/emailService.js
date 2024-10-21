const nodemailer = require('nodemailer');
const User = require('../models/users');
const Product = require('../models/products');

// Hàm gửi email xác nhận đơn hàng
const sendOrderConfirmationEmail = async (order) => {
  try {
    const user = await User.findById(order.user);
    if (!user) {
        throw new Error('Người dùng không tồn tại');
    }

    // Lấy thông tin sản phẩm từ cơ sở dữ liệu
    const productPromises = order.items.map(item => Product.findById(item.product));
    const products = await Promise.all(productPromises);

    // Tạo transporter sử dụng Gmail hoặc một dịch vụ SMTP khác
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Thay đổi nếu bạn sử dụng dịch vụ khác
      port: 465,
      secure: true,
      auth: {
        user: 'rafcartshop@gmail.com', // Email của bạn
        pass: 'owiezcfisuibyzdp', // Mật khẩu ứng dụng của email
      },
    });

    // Tạo nội dung HTML cho email
    const emailHTML = `
      <h1>Cảm ơn bạn đã đặt hàng!</h1>
      <p>Xin chào ${user.fullName},</p>
      <p>Đơn hàng của bạn đã được tạo thành công.</p>
      <p>Thông tin đơn hàng:</p>
      <ul style="list-style-type: none; padding: 0; margin: 0;">
        ${order.items.map((item, index) => {
            const product = products[index];
            return`
            <li style="margin-bottom: 10px;">
                <img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto;"/>
                ${item.quantity} x ${product.name} - ${item.price.toLocaleString()}đ (Màu: ${item.color}, Size: ${item.size})
            </li>
            `;
        }).join('')}
      </ul>
      <p>Tổng số tiền: ${order.totalAmount.toLocaleString()}đ</p>
      <p>Địa chỉ giao hàng: ${order.shippingAddress}</p>
      <p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được xử lý và giao hàng.</p>
      <p>Cảm ơn bạn đã mua sắm cùng chúng tôi!</p>
    `;

    // Tạo tùy chọn email
    const mailOptions = {
      from: 'rafcartshop@gmail.com', // Địa chỉ người gửi
      to: user.email, // Địa chỉ người nhận (người mua)
      subject: 'Xác nhận đơn hàng của bạn',
      html: emailHTML, // Gán nội dung HTML vào thuộc tính html
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
    console.log('Đã gửi email xác nhận đơn hàng');
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    throw new Error('Lỗi khi gửi email xác nhận đơn hàng');
  }
};

module.exports = { sendOrderConfirmationEmail };
