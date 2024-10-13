import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useProductContext } from '../context/ProductContext';
import styles from './ProductList.module.css';
// import ProductCard from './ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import ProductCard from './ProductCard';
import AddToCartButton from '../carts/AddToCartButton';

const RecommentProduct = () => {         //{ onAddToCart }
  const { products } = useProductContext();
  const { userId } = useUserContext();
  const [quantity, setQuantity] = useState(1); // State để quản lý số lượng sản phẩm mặc định là 1
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  // Hàm để lấy số lượng sản phẩm ngẫu nhiên từ danh sách
  const getRandomProducts = (products, count) => {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count); // Lấy `count` sản phẩm ngẫu nhiên
  };

  useEffect(() => {          
      fetchProducts();
  }, [products]);
  
  const fetchProducts = async () => {
      try {
        // const firstTenProducts = products.slice(0, 10);

        // Chọn 5 sản phẩm ngẫu nhiên làm gợi ý
        const randomProducts = getRandomProducts(products, 5);
        setSuggestedProducts(randomProducts);
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
      }
  };

  const addToFavorites = async (productId) => {
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
  return (
      // <div className={`${styles.productGrid} mt-6`}>
      // {(suggestedProducts.map((product) => (
      //     <div key={product._id} className="bg-white shadow rounded overflow-hidden group">
      //         <div className="relative">
      //             <div className={styles.productImage}>
      //                 <img
      //                 src={product.image}
      //                 alt={product.name}
      //                 style={{ width: '280px', height: '280px' }}
      //                 />
      //                 <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
      //                     <a
      //                         href={`/products/${product._id}`} // Chuyển đến trang chi tiết sản phẩm
      //                         className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
      //                         title="Xem chi tiết"
      //                     >
      //                         <FontAwesomeIcon icon={faEye} /> 
      //                     </a>
      //                     <a
      //                         href="#"
      //                         className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
      //                         title="Thêm vào yêu thích"
      //                         // Xử lý thêm vào danh sách yêu thích tại đây
      //                     >
      //                         <FontAwesomeIcon icon={faHeart} /> 
      //                     </a>
      //                 </div>
      //             </div>
      //         </div>
      //         <div className={styles.productDetails}>
      //             <strong>{product.name}</strong>
      //             <p>Giá: {product.price} VND</p>
      //             {/* <p>Mô tả: {product.description || 'Không có mô tả'}</p> */}
      //             {/* <p>Kích thước: {product.size.join(', ')}</p>
      //             <p>Màu sắc: {product.color.join(', ')}</p> */}
      //             <button
      //                 className="mt-2 w-full py-2 bg-primary text-white rounded transition duration-300 hover:bg-secondary" 
      //             >Thêm vào giỏ</button>
      //             {/* onClick={() => onAddToCart(product)} */}
      //         </div>
      //     </div>
      // )))}
      // <ToastContainer/>
      // </div>
      <div className={`${styles.productGrid} mt-6`}>
      { (suggestedProducts.map((product) => 
        <div key={product._id} className="bg-white shadow rounded overflow-hidden group">
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
                  className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                  title="Xem chi tiết"
                >
                  <FontAwesomeIcon icon={faEye} /> 
                </Link>
                <a
                  onClick={() => addToFavorites(product._id)}
                  className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
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
            <p>Giá: {product.price} VND</p>
            {/* <p>Mô tả: {product.description || 'Không có mô tả'}</p> */}
            {/* <p>Kích thước: {product.size.join(', ')}</p>
            <p>Màu sắc: {product.color.join(', ')}</p> */}
            {/* <button
              className="mt-2 w-full py-2 bg-primary text-white rounded transition duration-300 hover:bg-secondary" 
            >
              Thêm vào giỏ
            </button> */}
            {/* <AddToCartButton userId={userId} productId={product._id} quantity={quantity}/> */}
            <Link
              to={`/products/details/${product._id}`} // Chuyển đến trang chi tiết sản phẩm
              className=""
              title="Mua ngay"
            >
              <button 
                  className="mt-2 w-full py-2 bg-primary text-white rounded transition duration-300 hover:bg-secondary"
              >
                  Mua ngay
              </button>
            </Link>
            {/* onClick={() => onAddToCart(product)} */}
          </div>
        </div>
      ))}
      <ToastContainer/>
      </div>
  );
};

export default RecommentProduct;
