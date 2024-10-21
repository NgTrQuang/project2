import React from 'react';
import { useUserContext } from '../../components/context/UserContext';
import { useProductContext } from '../../components/context/ProductContext'; // Import ProductContext
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user } = useUserContext(); // Lấy thông tin người dùng từ context

  const { fetchProducts, setSearchTerm } = useProductContext(); // Lấy hàm setSearchTerm từ context

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e) => {
    fetchProducts();
    setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
    if (location.pathname !== '/products') {
      // Nếu không phải trang /products, điều hướng tới đó với từ khóa tìm kiếm
      navigate(`/products`);
    }
  };
  
  return (
    <header className="py-4 shadow-sm bg-white">
      <div className="flex justify-center">
        <a href="/" className="mb-4 md:mb-0">
          <img src="assets/images/logo.png" alt="Logo" className="w-32 md:w-48 mx-auto" />
        </a>
      </div>
      <div className="container flex items-center justify-between">
        <div className="hidden md:flex w-full max-w-md relative flex-grow">
          <span className="absolute left-4 top-2 text-lg text-gray-400">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            type="text"
            name="search"
            id="search"
            className="w-full border border-gray-300 pl-10 py-2 pr-2 rounded-lg focus:ring-2 focus:ring-green-200 focus:outline-none"
            placeholder="Tìm kiếm sản phẩm..."
            onChange={handleSearchChange} // Gọi hàm khi nhập liệu
          />
        </div>
        
        {user ? (
        <div className="flex items-center space-x-4">
          <a href="/favorites" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-2xl">
              <i class="fa-solid fa-heart"></i>
            </div>
            <div className="text-xs leading-3">Yêu thích</div>
          </a>
          <a href="/cart" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-2xl">
              <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <div className="text-xs leading-3">Giỏ hàng</div>
          </a>
          <a href="/profile" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-2xl">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="text-xs leading-3">{user.username}</div>
          </a>
        </div>
        ) : (
        <div className="flex items-center space-x-4">
          <a href="/login" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-2xl">
              <i class="fa-solid fa-heart"></i>
            </div>
            <div className="text-xs leading-3">Yêu thích</div>
          </a>
          <a href="/login" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-2xl">
              <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <div className="text-xs leading-3">Giỏ hàng</div>
          </a>
          <a href="/login" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-2xl">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="text-xs leading-3">Tài khoản</div>
          </a>
        </div>
        )}
      </div>
    </header>
  );
};

export default Header;
