const User = require('../models/users/users'); // Model người dùng
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Đăng ký
const register = async (req, res) => {
  const { username, email, password, fullName, address, phoneNumber, role } = req.body;

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullName,      
      address,       
      phoneNumber,   
      role: 'customer',          
    });
    // Lưu người dùng vào database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Đăng nhập
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm người dùng qua username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    // const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET, // Bạn sẽ khai báo biến môi trường này
      { expiresIn: '30d' } // Thời gian tồn tại của token là 30 ngày
    );

    // Trả về token và thông tin người dùng
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

const logout = (req, res) => {
    // Thông báo thành công và client sẽ tự xoá token
    res.status(200).json({ message: 'Logout successful' });
};
  
module.exports = { register, login, logout };
  