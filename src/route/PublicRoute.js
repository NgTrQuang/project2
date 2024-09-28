// PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../components/context/UserContext'; // Nhập context

const PublicRoute = ({ component: Component }) => {
  const { user } = useUserContext(); // Lấy thông tin người dùng từ context

  // Nếu người dùng đã đăng nhập, điều hướng đến trang chính
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Nếu chưa đăng nhập, hiển thị component truyền vào
  return <Component />;
};

export default PublicRoute;
