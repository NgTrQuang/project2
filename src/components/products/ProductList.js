import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
import { useProductContext } from '../context/ProductContext';
import styles from './ProductList.module.css';
import ProductCard from './ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faHeart } from '@fortawesome/free-solid-svg-icons';

const ProductList = () => {         //{ onAddToCart }
  const { products, setSearchTerm } = useProductContext();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // const filteredProducts = products.filter((product) =>
  //   product.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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
        {products.length > 0 ? 
          (products.map((product) => (
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
                  <a
                    href={`/products/${product._id}`} // Chuyển đến trang chi tiết sản phẩm
                    className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                    title="Xem chi tiết"
                  >
                    <FontAwesomeIcon icon={faEye} /> 
                  </a>
                  <a
                    href="#"
                    className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                    title="Thêm vàoyêu thích"
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
              <button
                className="mt-2 w-full py-2 bg-primary text-white rounded transition duration-300 hover:bg-secondary" 
              >Thêm vào giỏ</button>
              {/* onClick={() => onAddToCart(product)} */}
            </div>
          </div>
          // <ProductCard key={product._id} product={product}/>
            ))
        ) : (
          <p>Không tìm thấy sản phẩm</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
