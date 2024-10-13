import React from 'react';
import axios from 'axios';
import { useUserContext } from '../../components/context/UserContext';
import { useProductContext } from '../../components/context/ProductContext';
import { useNavigate } from 'react-router-dom';
import Logout from '../../components/auth/Logout'
const Navbar = () => {
  const { user } = useUserContext();
  const { setProducts } = useProductContext();

  const navigate = useNavigate();

  const handleCategoryClick = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products/category?category=${categoryId}`);
      console.log('Danh sách sản phẩm:', response.data); // Kiểm tra dữ liệu trả về
      // navigate(`/products?category=${categoryId}`);
      setProducts(response.data);
      navigate('/products');
    } catch (error) {
      console.error('Lỗi khi tìm kiếm sản phẩm:', error);
    }
  };

  return (
    <nav className="bg-gray-800">
      <div className="container flex">
        <div className="px-8 py-4 bg-primary md:flex items-center cursor-pointer relative group hidden">
          <span className="text-white">
            <i className="fa-solid fa-bars"></i>
          </span>
          <span className="capitalize ml-2 text-white">Danh mục</span>
          {/* Dropdown */}
          <div className="absolute w-full left-0 top-full bg-white shadow-md py-3 divide-y divide-gray-300 divide-dashed opacity-0 group-hover:opacity-100 transition duration-300 invisible group-hover:visible">
            <a onClick={() => handleCategoryClick('66f7c5b8d3de0bcc1cdbf6ef')} className="flex items-center px-6 py-3 hover:bg-gray-100 transition">
              <img src="assets/images/icons/T-shirt.png" alt="T-shirt" className="w-5 h-5 object-contain" />
              <span className="ml-6 text-gray-600 text-sm">T-Shirt</span>
            </a>
            <a onClick={() => handleCategoryClick('66f7c5b8d3de0bcc1cdbf6f0')} className="flex items-center px-6 py-3 hover:bg-gray-100 transition">
              <img src="assets/images/icons/jeans.png" alt="Jean" className="w-5 h-5 object-contain" />
              <span className="ml-6 text-gray-600 text-sm">Jean</span>
            </a>
            <a onClick={() => handleCategoryClick('66f7c5b8d3de0bcc1cdbf6f1')} className="flex items-center px-6 py-3 hover:bg-gray-100 transition">
              <img src="assets/images/icons/hoodie.png" alt="Hoodie" className="w-5 h-5 object-contain" />
              <span className="ml-6 text-gray-600 text-sm">Hoodies</span>
            </a>
            <a onClick={() => handleCategoryClick('66f7c5b8d3de0bcc1cdbf6f2')} className="flex items-center px-6 py-3 hover:bg-gray-100 transition">
              <img src="assets/images/icons/somi2.png" alt="somi" className="w-5 h-5 object-contain" />
              <span className="ml-6 text-gray-600 text-sm">Sơ mi</span>
            </a>
            <a onClick={() => handleCategoryClick('66f7c5b8d3de0bcc1cdbf6f3')} className="flex items-center px-6 py-3 hover:bg-gray-100 transition">
              <img src="assets/images/icons/thethaoA7.png" alt="thethao" className="w-5 h-5 object-contain" />
              <span className="ml-6 text-gray-600 text-sm">Thể thao</span>
            </a>
            <a onClick={() => handleCategoryClick('66f7c5b8d3de0bcc1cdbf6f4')} className="flex items-center px-6 py-3 hover:bg-gray-100 transition">
              <img src="assets/images/icons/short.jpg" alt="Short" className="w-5 h-5 object-contain" />
              <span className="ml-6 text-gray-600 text-sm">Short</span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between flex-grow md:pl-12 py-5">
          <div className="flex items-center space-x-6 capitalize">
            <a href="/" className="text-gray-200 hover:text-white transition">Trang chủ</a>
            <a href="/products" className="text-gray-200 hover:text-white transition">Cửa hàng</a>
            <a href="/" className="text-gray-200 hover:text-white transition">Về chúng tôi</a>
            <a href="/" className="text-gray-200 hover:text-white transition">Liên hệ</a>
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
