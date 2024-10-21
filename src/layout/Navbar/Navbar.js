import React from 'react';
import { useUserContext } from '../../components/context/UserContext';
import Logout from '../../components/auth/Logout'
const Navbar = () => {
  const { user } = useUserContext();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-gray-700">
      <div className="container flex">
        <div className="flex items-center justify-between flex-grow md:pl-12 py-5">
          <div className="flex items-center space-x-6 capitalize">
            <a href="/" className="text-gray-200 hover:text-white transition">Trang chủ</a>
            <button 
              className="text-gray-200 hover:text-white transition"
              onClick={() => scrollToSection('section2')} 
            >
              Danh mục
            </button>
            <a href="/products" className="text-gray-200 hover:text-white transition">Cửa hàng</a>
            <button 
              className="text-gray-200 hover:text-white transition"
              onClick={() => scrollToSection('section3')} 
            >
              Về chúng tôi
            </button>
            <button 
              className="text-gray-200 hover:text-white transition"
              onClick={() => scrollToSection('section4')} 
            >
              Liên hệ
            </button>
          </div>
          {user ? (
            <Logout />
          ) : (
            <a href="/login" className="text-gray-200 hover:text-white transition">Đăng nhập</a>
          )}
          {/* <a href="/login" className="text-gray-200 hover:text-white transition">Login</a> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
