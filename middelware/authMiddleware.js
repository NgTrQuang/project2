const jwt = require('jsonwebtoken');

// Middleware xác thực JWT
const authenticateToken = (req, res, next) => {
  // Lấy token từ header 'Authorization'
  const authHeader = req.headers['authorization'];
  // console.log('Authorization Header:', authHeader); // Log header nhận được

  // Kiểm tra xem header có tồn tại không
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  // Tách token ra khỏi header 'Bearer'
  const token = authHeader.split(' ')[1];
  // console.log('Token received:', token); // Log token nhận được

  // Kiểm tra định dạng token
  if (!token) {
    return res.status(400).json({ message: 'Invalid token format' });
  }

  try {
    // Kiểm tra token hợp lệ
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Thêm thông tin người dùng vào request
    next();
  } catch (error) {
    // console.error('Token verification error:', error); // Log chi tiết lỗi
    res.status(400).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = authenticateToken;
