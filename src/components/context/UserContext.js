import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Thêm import này
import axios from 'axios';
// Tạo Context
const UserContext = createContext();

// Tạo Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Kiểm tra localStorage khi component được mount
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      // Giải mã thông tin người dùng từ token
      try {
        const decoded = jwtDecode(token); // Giải mã token
        setUser(decoded); // Giả sử thông tin người dùng có trong payload của token
      } catch (error) {
        console.error('Failed to decode token:', error);
      }

      // Nếu bạn vẫn muốn gọi API để xác nhận hoặc lấy thêm thông tin người dùng
      const fetchUserData = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };

      // Gọi API nếu cần
      fetchUserData();
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook để sử dụng Context
export const useUserContext = () => {
  return useContext(UserContext);
};
