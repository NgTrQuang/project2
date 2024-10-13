import React from 'react';
import { useState, useEffect} from 'react';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PersonalInfo = () => {
  const { user, setUser } = useUserContext();

  // State để quản lý các giá trị của form
  // const [fullName, setFullName] = useState(user.fullName);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(''); 
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  // Thêm state để lưu trữ lỗi
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    let formErrors = {};

    // Kiểm tra họ và tên
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!firstName || !nameRegex.test(firstName)) {
      formErrors.firstName = "Tên không hợp lệ. Vui lòng nhập tên chỉ chứa chữ cái.";
    }
    if (!lastName || !nameRegex.test(lastName)) {
      formErrors.lastName = "Họ và tên lót không hợp lệ. Vui lòng nhập họ tên chỉ chứa chữ cái.";
    }

    // Kiểm tra số điện thoại (chỉ chứa số và có đúng 10 ký tự)
    const phoneRegex = /^[0-9]{10,13}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      formErrors.phoneNumber = "Số điện thoại phải là số không có kí tự đặc biệt";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // True nếu không có lỗi
  };

  // Xử lý phân tách họ và tên
  // const [firstName, ...lastName] = user.fullName ? user.fullName.split(' ') : ['Guest'];
  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedUser = {
      fullName: `${firstName} ${lastName}`,
      phoneNumber,
    };

    // Kiểm tra ràng buộc trước khi gửi form
    if (!validateForm()) {
        return;
    }

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
        toast.success("Đã cập nhật thành công", {
          position: "top-right",
          autoClose: 3000, // tự đóng sau 3 giây
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
      });
        // alert('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Lỗi cập nhật thông tin, vui lòng cập nhật lại", {
        position: "top-right",
        autoClose: 3000, // tự đóng sau 3 giây
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
      // alert('There was an error updating your profile');
    }
  };

  return (
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
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
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
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
            </div>

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
                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
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
    <ToastContainer/>          
    </div>
  );
};

export default PersonalInfo;
