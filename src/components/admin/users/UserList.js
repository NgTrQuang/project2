import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../../context/UserContext';

const UserList = () => {
    const { user } = useUserContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    // Gọi API để lấy danh sách người dùng
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/users/all', {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào headers
            },
        });
        setUsers(response.data.users); // Gán dữ liệu vào state
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users', error);
        setLoading(false);
      }
    };

    if (user?.role === 'admin') { // Chỉ fetch nếu user là admin
        fetchUsers();
    } else {
        console.log('Lỗi chỉ admin mới có quyền truy cập');
        setLoading(false);
    }

    fetchUsers();
  }, [user]);

  // Xử lý vô hiệu hóa tài khoản
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axios.patch(`http://localhost:3000/api/users/${userId}/status`, { isDisabled: newStatus });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isDisabled: newStatus } : user
      ));
    } catch (error) {
      console.error('Failed to update user status', error);
    }
  };

  // Xử lý nâng cấp quyền người dùng lên Admin
  const handleUpgradeToAdmin = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:3000/api/users/upgrade/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message); // Hiển thị thông báo khi nâng cấp thành công
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: 'admin' } : user
      ));
    } catch (error) {
      alert(error.response?.data.message || 'Lỗi khi nâng cấp tài khoản');
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Danh sách người dùng</h2>
      {users.length > 0 ?       
       (<table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Tên</th>
            <th className="py-2">Email</th>
            <th className="py-2">Vai trò</th>
            <th className="py-2">Trạng thái</th>
            <th className="py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
                <td className="py-2">{user.fullName}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">
                  {user.role === 'admin' ? 'Admin' : 'Customer'}
                </td>
                <td className="py-2">
                    {user.isDisabled ? 'Đã vô hiệu hóa' : 'Đang hoạt động'}
                </td>
                <td className="py-2 flex space-x-2">
                    <button
                    className={`px-2 py-2 rounded ${
                        user.isDisabled ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}
                    onClick={() => handleToggleStatus(user._id, user.isDisabled)}
                    >
                    {user.isDisabled ? 'Kích hoạt' : 'Vô hiệu hóa'}
                    </button>
                    {user.role !== 'admin' && (
                    <button
                      className="px-4 py-2 rounded bg-blue-500 text-white"
                      onClick={() => handleUpgradeToAdmin(user._id)}
                    >
                      <i class="fa-regular fa-hand-point-up"></i>
                    </button>
                    )}
                </td>
            </tr>
          ))}
        </tbody>
        </table>
        ) : <p>Danh sách trống.</p>}
    </div>
  );
};

export default UserList;
