import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import { useProductContext } from '../context/ProductContext';
import styles from './ProductList.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import AddToCartButton from '../carts/AddToCartButton';
import SizeList from './SizeList';
import ColorList from './ColorList';
import QuantitySelector from './QuantitySelector';
import Pagination from '../../common/Pagination';

const ProductList = () => {         //{ onAddToCart }
  const { products, setSearchTerm } = useProductContext();
  const { userId } = useUserContext();
  const [quantity, setQuantity] = useState(1); // State để quản lý số lượng sản phẩm mặc định là 1
  // const [quantity, setQuantity] = useState(1); // State để lưu số lượng sản phẩm
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5); // Số sản phẩm trên mỗi trang

  // Hàm mở modal
  const openModal = (product) => {
    setSelectedProduct(product);
    console.log(product);
    console.log(selectedProduct);
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setSelectedColor('');
    setSelectedSize('');
    setQuantity(1);
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };
  
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };
  
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const addToFavorites = async (productId) => {
    if(!userId){
      toast.info("Bạn cần đăng nhập để thêm sản phẩm vào yêu thích!", {
        position: "top-right",
        autoClose: 3000, // tự đóng sau 3 giây
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    try {
      await axios.post('http://localhost:3000/api/favorites/add_to_favorite', { userId, productId });
      // Show success toast notification
      toast.success("Sản phẩm đã được thêm vào mục yêu thích", {
        position: "top-right",
        autoClose: 3000, // tự đóng sau 3 giây
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // alert('Sản phẩm đã được thêm vào mục yêu thích');
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào yêu thích:', error);
    }
  };
  // const filteredProducts = products.filter((product) =>
  //   product.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  // Tính toán chỉ số sản phẩm cho trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className={styles.productListContainer}>
      {/* <h2>Danh sách sản phẩm</h2> */}
      <div className="block md:hidden flex justify-center my-4">
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        // value={searchTerm}
        onChange={handleSearchChange}
        className="w-full max-w-xs border border-primary pl-4 py-2 rounded-md focus:outline-none"
      />
      </div>
      <div className={`${styles.productGrid} mt-6`}>
        {currentProducts.length > 0 ? 
          (currentProducts.map((product) => (
          <div key={product._id} className={`bg-white shadow rounded overflow-hidden group`}>
            {/* <div className={styles.productImage}>
              <strong>{product.name}</strong> - {product.price} VND
            </div> */}
            <div className="relative">
              <div className={styles.productImage}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '280px', height: '280px' }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <Link
                    to={`/products/details/${product._id}`} // Chuyển đến trang chi tiết sản phẩm
                    className="text-black text-lg w-9 h-8 rounded-full bg-white flex items-center justify-center hover:bg-primary transition"
                    title="Xem chi tiết"
                  >
                    <FontAwesomeIcon icon={faEye} /> 
                  </Link>
                  <a
                    onClick={() => addToFavorites(product._id)}
                    className="text-black text-lg w-9 h-8 rounded-full bg-white flex items-center justify-center hover:bg-primary transition"
                    title="Thêm vào yêu thích"
                    // Xử lý thêm vào danh sách yêu thích tại đây
                  >
                    <FontAwesomeIcon icon={faHeart} /> 
                  </a>
                </div>
              </div>
            </div>
            <div className={styles.productDetails}>
              <strong>{product.name}</strong>
              <p>Giá: {product.price.toLocaleString()} VND</p>
              {/* <p>Mô tả: {product.description || 'Không có mô tả'}</p> */}
              {/* <p>Kích thước: {product.size.join(', ')}</p>
              <p>Màu sắc: {product.color.join(', ')}</p> */}
              {/* <button
                className="mt-2 w-full py-2 bg-primary text-white rounded transition duration-300 hover:bg-secondary" 
              >
                Thêm vào giỏ
              </button> */}
              {/* onClick={() => onAddToCart(product)} */}
              <button
                onClick={() => openModal(product)}
                className="mt-2 w-full py-2 bg-green-600 text-black rounded transition duration-300 hover:bg-secondary"
              >
                Thêm vào giỏ hàng
              </button>
              {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h1 className="text-lg font-semibold mb-4">{selectedProduct.name}</h1>
                        <h2 className="text-lg font-semibold mb-4">Chọn màu sắc và kích thước</h2>
                        {/* Dropdown chọn kích thước */}
                        <label className="block mb-2">Chọn kích thước:</label>
                        <SizeList 
                          sizes={[...new Set(selectedProduct.variants.map(variant => variant.size))]} 
                          selectedSize={selectedSize}
                          handleSizeChange={handleSizeChange}
                        />
                        {/* Dropdown chọn màu sắc */}
                        <label className="block mb-2">Chọn màu sắc:</label>
                        <ColorList 
                          colors={[...new Set(selectedProduct.variants.map(variant => variant.color))]} 
                          selectedColor={selectedColor}
                          handleColorChange={handleColorChange}
                        />
                        {/* Selector số lượng */}
                        <QuantitySelector 
                          quantity={quantity} 
                          onQuantityChange={handleQuantityChange}
                          selectedProduct={selectedProduct} 
                          selectedColor={selectedColor}
                          selectedSize={selectedSize}
                        />

                        {/* Nút Thêm vào giỏ hàng */}
                        <AddToCartButton 
                          userId={userId} 
                          productId={selectedProduct._id} 
                          quantity={quantity} 
                          size={selectedSize}
                          color={selectedColor} 
                        />
                        {/* Nút Hủy */}
                        <button 
                            onClick={closeModal} 
                            className="w-full py-2 bg-gray-300 rounded mt-2"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
              )}
            </div>
          </div>
          // <ProductCard key={product._id} product={product}/>
            ))
        ) : (
          <p>Không tìm thấy sản phẩm</p>
        )}
      </div>
      {totalPages > 1 && 
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          paginate={(pageNumber) => setCurrentPage(pageNumber)}
        />
      }
      <ToastContainer/>
    </div>
  );
};

export default ProductList;
