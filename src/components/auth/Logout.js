import React from 'react';
import { useUserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const YourComponent = () => {
  const { logout } = useUserContext(); // Giả định bạn đã có hàm logout trong context
  const navigate = useNavigate(); // Nếu bạn sử dụng React Router

  const handleLogout = () => {
    logout();
    toast.success('Đăng xuất thành công!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
    navigate('/login'); // Hoặc window.location.href = '/login';
  };

  return (
    <button onClick={handleLogout} className="text-gray-200 hover:text-white transition">
      Đăng xuất
    </button>
  );
};

export default YourComponent;
