import React from 'react';
import { useState, useEffect} from 'react';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';

const Profile = () => {
  const { user, setUser } = useUserContext();

  // State để quản lý các giá trị của form
  // const [fullName, setFullName] = useState(user.fullName);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(''); 
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.fullName?.split(' ')[0] || '');
      setLastName(user.fullName?.split(' ').slice(1).join(' ') || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
      setAddress(user.address || '');
    }
  }, [user]);
  
  if (!user) {
    return <div className="container py-16">You are not logged in.</div>;
  }
  // Xử lý phân tách họ và tên
  // const [firstName, ...lastName] = user.fullName ? user.fullName.split(' ') : ['Guest'];
  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedUser = {
      fullName: `${firstName} ${lastName}`,
      // email,
      phoneNumber,
      // address,
    };

    try {
      // Gửi request PUT để cập nhật thông tin
      const response = await axios.put('http://localhost:3000/api/users/me', updatedUser,
        {
          headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust this if your token is stored differently
          }
        }
      );

      // Nếu thành công, cập nhật context
      if (response.status === 200) {
        setUser(response.data); // Cập nhật lại user trong context
        // setFullName(`${firstName} ${lastName}`);
        alert('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('There was an error updating your profile');
    }
  };

  return (
    // <div className="container py-16">
    //   <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
    //     <h2 className="text-2xl uppercase font-medium mb-1">Profile</h2>
    //     <p><strong>Username:</strong> {user.username}</p>
    //     <p><strong>Full Name:</strong> {user.fullName || 'Not provided'}</p>
    //     <p><strong>Email:</strong> {user.email}</p>
    //     <p><strong>Address:</strong> {user.address || 'Not provided'}</p>
    //     <p><strong>Phone Number:</strong> {user.phoneNumber || 'Not provided'}</p>
    //     <p><strong>Role:</strong> {user.role}</p>
    //   </div>
    // </div>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
      
      {/* Layout with responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-md p-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0">
                <img 
                  src="../assets/images/avatar.png" 
                  alt="profile"
                  className="rounded-full w-16 h-16 border border-gray-200 p-1 object-cover" 
                />
              </div>
              <div>
                <p className="text-gray-600">Chào,</p>
                <h4 className="text-gray-800 font-medium">{user.fullName || 'Guest'}</h4>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                  Quản lý tài khoản
                </a>
                <a href="#" className="block text-gray-600 hover:text-primary transition">
                  Thông tin tài khoản
                </a>
                <a href="#" className="block text-gray-600 hover:text-primary transition">
                  Quản lý địa chỉ
                </a>
                <a href="#" className="block text-gray-600 hover:text-primary transition">
                  Đổi mật khẩu
                </a>
              </div>

              <div className="pt-4 space-y-1">
                <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                  Lịch sử đơn hàng
                </a>
                <a href="#" className="block text-gray-600 hover:text-primary transition">
                  Mua lại
                </a>
                <a href="#" className="block text-gray-600 hover:text-primary transition">
                  Đã hủy
                </a>
                <a href="#" className="block text-gray-600 hover:text-primary transition">
                  Đánh giá của bạn
                </a>
              </div>

              <div className="pt-4 space-y-1">
                <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                  Phương thức thanh toán
                </a>
                <a href="#" className="block text-gray-600 hover:text-primary transition">
                  Voucher
                </a>
              </div>

              {/* <div className="pt-4 space-y-1">
                <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                  My wishlist
                </a>
              </div> */}

              {/* <div className="pt-4 space-y-1">
                <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                  Logout
                </a>
              </div> */}
            </div>
          </div>
        </div>
        {/* ./Sidebar */}

        {/* Profile info */}
        <div className="md:col-span-2">
          <div className="bg-white shadow-md rounded-md p-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Thông tin tài khoản</h4>
            <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                    <label htmlFor="first" className="block text-gray-600">Họ</label>
                    <input 
                        type="text" 
                        name="first" 
                        id="first" 
                        value={firstName} // First name
                        onChange={(e) => setFirstName(e.target.value)} // Cập nhật state
                        className="input-box w-full"
                        placeholder="John"
                    />
                    </div>
                    <div>
                    <label htmlFor="last" className="block text-gray-600">Họ lót và tên</label>
                    <input 
                        type="text" 
                        name="last" 
                        id="last"
                        value={lastName} // Last name .join(' ')
                        onChange={(e) => setLastName(e.target.value)} // Cập nhật state
                        className="input-box w-full"
                        placeholder="Doe"
                    />
                    </div>
                </div>

              {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="birthday" className="block text-gray-600">Birthday</label>
                  <input 
                    type="date" 
                    name="birthday" 
                    id="birthday" 
                    className="input-box w-full"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-gray-600">Gender</label>
                  <select 
                    name="gender" 
                    id="gender" 
                    className="input-box w-full"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div> */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                    <label htmlFor="email" className="block text-gray-600">Địa chỉ email</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Cập nhật state
                        className="input-box w-full"
                        placeholder="john.doe@example.com"
                        readOnly 
                    />
                    </div>
                    <div>
                    <label htmlFor="phone" className="block text-gray-600">Số điện thoại</label>
                    <input 
                        type="text" 
                        name="phone" 
                        id="phone"
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} // Cập nhật state
                        className="input-box w-full"
                        placeholder="+123 456 789"
                    />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                    <label htmlFor="address" className="block text-gray-600">Địa chỉ</label>
                    <input 
                        type="text" 
                        name="address" 
                        id="address" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)} // Cập nhật state
                        className="input-box w-full"
                        readOnly
                    />
                    </div>
                    <div>
                    <label htmlFor="role" className="block text-gray-600">Loại tài khoản</label>
                    <input 
                        type="text" 
                        name="role" 
                        id="role" 
                        value={user.role || 'customer'}
                        className="input-box w-full"
                        readOnly
                    />
                    </div>
                </div>
            </div>

            <div className="mt-6">
              <button 
                type="submit"
                className="w-full sm:w-auto px-4 py-3 text-white bg-primary rounded-md hover:bg-transparent hover:text-primary border border-primary transition"
              >
                Lưu thay đổi
              </button>
            </div>
            </form>
          </div>
        </div>
        {/* ./Profile info */}
      </div>
    </div>
  );
};

export default Profile;
