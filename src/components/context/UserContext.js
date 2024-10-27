import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Thêm import này
import axios from 'axios';
// Tạo Context
const UserContext = createContext();

// Tạo Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    // Kiểm tra localStorage khi component được mount
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      // Giải mã thông tin người dùng từ token
      try {
        const decoded = jwtDecode(token); // Giải mã token
        // setUser(decoded); // Giả sử thông tin người dùng có trong payload của token
        if (decoded && decoded?._id) {
          setUser(decoded);
          setUserId(decoded?._id);
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
      }

      // Nếu bạn vẫn muốn gọi API để xác nhận hoặc lấy thêm thông tin người dùng
      if (!userId) {
        const fetchUserData = async () => {
          try {
            const response = await axios.get('http://localhost:3000/api/users/me', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              timeout: 5000, // Thêm timeout để tránh các API call kéo dài
            });
            setUser(response.data?.user);
            setUserId(response.data?.user?._id);
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        };       
      // Gọi API nếu cần
      fetchUserData();
      }
    }
  }, [userId]);

  const login = (userData) => {
    setUser(userData);
    setUserId(userData?._id);
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, setUser, userId, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook để sử dụng Context
export const useUserContext = () => {
  return useContext(UserContext);
};
