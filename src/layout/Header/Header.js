import React from 'react';
import { useUserContext } from '../../components/context/UserContext';
import { useProductContext } from '../../components/context/ProductContext'; // Import ProductContext

const Header = () => {
  const { user } = useUserContext(); // Lấy thông tin người dùng từ context

  const { setSearchTerm } = useProductContext(); // Lấy hàm setSearchTerm từ context

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
  };

  // const [searchTerm, setSearchTerm] = useState('');
  // const navigate = useNavigate();

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   // Điều hướng tới trang /products với từ khóa tìm kiếm dưới dạng query parameter
  //   navigate(`/products?search=${searchTerm}`);
  // };
  
  return (
    <header className="py-4 shadow-sm bg-white">
      <div className="container flex items-center justify-between">
        <a href="/" className="mb-4 md:mb-0">
          <img src="assets/images/logo.svg" alt="Logo" className="w-24 md:w-32" />
        </a>

        <div className="hidden md:flex w-full max-w-xl relative flex-grow">
          <span className="absolute left-4 top-3 text-lg text-gray-400">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            type="text"
            name="search"
            id="search"
            className="w-full border border-primary border-r-0 pl-12 py-3 pr-3 rounded-l-md focus:outline-none"
            placeholder="Tìm kiếm sản phẩm..."
            onChange={handleSearchChange} // Gọi hàm khi nhập liệu
          />
          <button className="bg-primary border border-primary text-white px-8 rounded-r-md hover:bg-transparent hover:text-primary transition">
            Tìm kiếm
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <a href="#" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-2xl">
              <i className="fa-regular fa-heart"></i>
            </div>
            <div className="text-xs leading-3">Yêu thích</div>
            <div className="absolute right-0 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white text-xs">
              8
            </div>
          </a>
          <a href="#" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-2xl">
              <i className="fa-solid fa-bag-shopping"></i>
            </div>
            <div className="text-xs leading-3">Giỏ hàng</div>
            <div className="absolute -right-3 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white text-xs">
              2
            </div>
          </a>
          {/* <a href="#" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-2xl">
              <i className="fa-regular fa-user"></i>
            </div>
            <div className="text-xs leading-3">Account</div>
          </a> */}
          {user ? (
            <a href="/profile" className="text-center text-gray-700 hover:text-primary transition relative">
              <div className="text-2xl">
                <i className="fa-regular fa-user"></i>
              </div>
              <div className="text-xs leading-3">{user.username}</div>
            </a>
          ) : (
            <a href="/login" className="text-center text-gray-700 hover:text-primary transition relative">
              <div className="text-2xl">
                <i className="fa-regular fa-user"></i>
              </div>
              <div className="text-xs leading-3">Tài khoản</div>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
