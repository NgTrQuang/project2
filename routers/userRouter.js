const express = require('express');
const router = express.Router();
const {
    getUserFromToken,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    getUserById,
    toggleUserStatus,
    upgradeToAdmin
  } = require('../controllers/userController');
const authMiddleware = require('../middelware/authMiddleware');

// Route lấy thông tin người dùng từ token
router.get('/me', authMiddleware, getUserFromToken);

// Route lấy tất cả người dùng (Chỉ Admin có quyền)
router.get('/all', authMiddleware, getAllUsers);

// Tạo người dùng mới
router.post('/', createUser);

// Cập nhật thông tin cá nhân
router.put('/me', authMiddleware, updateUser); 

// Xóa người dùng (Chỉ dành cho Admin)
router.delete('/:id', authMiddleware, deleteUser); 

// Thay đổi mật khẩu
router.put('/password', changePassword); 

// Lấy thông tin người dùng theo ID (Chỉ dành cho Admin)
router.get('/:id', authMiddleware, getUserById); 

// Route để vô hiệu hóa hoặc kích hoạt tài khoản người dùng
router.patch('/:userId/status', toggleUserStatus);

// Đảm bảo người dùng đã đăng nhập và có quyền Admin
router.patch('/upgrade/:userId', authMiddleware, upgradeToAdmin);

module.exports = router;
