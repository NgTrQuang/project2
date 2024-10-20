const User = require('../models/users/users');

// API để lấy thông tin người dùng từ token
const getUserFromToken = async (req, res) => {
  try {
    // req.user sẽ có thông tin người dùng từ token sau khi middleware đã giải mã
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Trả về thông tin người dùng
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Chức năng nâng cấp tài khoản từ Customer lên Admin
const upgradeToAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
    // Tìm người dùng theo ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra xem người dùng đã là admin chưa
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Người dùng này đã là admin' });
    }

    // Cập nhật vai trò người dùng thành admin
    user.role = 'admin';
    await user.save();

    res.status(200).json({ message: 'Đã nâng cấp người dùng thành admin thành công', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi trong quá trình nâng cấp', error });
  }
};

// API để lấy tất cả người dùng (Chỉ dành cho Admin)
const getAllUsers = async (req, res) => {
    try {
      // Kiểm tra nếu người dùng là Admin
      if (req.user.role === "admin") {
        return res.status(403).json({ message: 'Không có quyền truy cập' });
      }
  
      const users = await User.find(); // Tìm tất cả người dùng trong DB
      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server' });
    }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Kiểm tra xem email có tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Tạo người dùng mới
    const newUser = new User({
      username,
      email,
      password, // Đảm bảo đã mã hóa mật khẩu trong middleware hoặc model
      fullName
    });

    await newUser.save();
    res.status(201).json({ message: 'Người dùng đã được tạo thành công', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, address } = req.body;

    // Check if any field is missing
    if (!fullName && !email && !phoneNumber && !address) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const user = await User.findById(req.user.id); // req.user.id từ token
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Cập nhật thông tin
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    // Chỉ admin mới có quyền xóa
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    await user.remove();
    res.json({ message: 'Người dùng đã bị xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không chính xác' });
    }

    // Đổi mật khẩu
    user.password = newPassword; // Đảm bảo mã hóa mật khẩu trước khi lưu
    await user.save();

    res.json({ message: 'Mật khẩu đã được thay đổi thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getUserById = async (req, res) => {
  try {
    // Chỉ admin mới có quyền xem thông tin người dùng
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isDisabled } = req.body; // Truyền trạng thái isDisabled (true hoặc false)

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isDisabled = isDisabled; // Cập nhật trạng thái vô hiệu hóa
    await user.save();

    res.status(200).json({ success: true, message: `User status updated to ${isDisabled ? 'disabled' : 'enabled'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user status' });
  }
};

module.exports = {
  getUserFromToken,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  getUserById,
  toggleUserStatus,
  upgradeToAdmin,
};

