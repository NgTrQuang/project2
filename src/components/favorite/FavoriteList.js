import React, { useState } from 'react';
// import styles from './FavoriteList.module.css'; // Import CSS module nếu cần
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import AddToCartButton from '../carts/AddToCartButton';
import QuantitySelector from '../products/QuantitySelector';
import { Link } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';

const FavoriteList = ({ userId, favoriteItems, handleRemoveFavorite }) => {

  // const [quantities, setQuantities] = useState({});

  // const handleQuantityChange = (productId, newQuantity) => {
  //   setQuantities(prevQuantities => ({
  //     ...prevQuantities,
  //     [productId]: newQuantity,
  //   }));
  // };  
  // const { quantity } = useCartContext();

  return (
    <div className="col-span-9 space-y-4">
      {favoriteItems.length > 0 ? favoriteItems.map((item) => (
        <div key={item._id} className="flex items-center justify-between border gap-6 p-4 border-gray-200 rounded">
          {/* Product Image */}
          <div className="w-28">
            <img src={item.image[0]} alt={item.name} className="w-full" />
          </div>

          {/* Product Details */}
          <div className="w-1/3">
            <h2 className="text-gray-800 text-xl font-medium uppercase">{item.name}</h2>
            {/* <p className="text-gray-500 text-sm">
              Availability: 
              <span className={item.inStock ? 'text-green-600' : 'text-red-600'}>
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </p> */}
            {/* <QuantitySelector 
              quantity={quantities[item._id] || 1} // Truyền số lượng vào QuantitySelector
              onQuantityChange={(newQuantity) => handleQuantityChange(item._id, newQuantity)}
              onRemove={() => handleRemoveFavorite(item._id)} // Gọi hàm xóa khi số lượng về 0
            /> */}
          </div>

          {/* Product Price */}
          <div className="text-primary text-lg font-semibold">{item.price} VND</div>

          {/* Quantity Selector */}
          {/* <QuantitySelector 
            onQuantityChange={(newQuantity) => handleQuantityChange(item._id, newQuantity)} 
          /> */}
          {/* Add to Cart Button */}
          <Link
            to={`/products/details/${item._id}`} // Chuyển đến trang chi tiết sản phẩm
            className=""
            title="Xem chi tiết"
          >
            <button 
                className="mt-2 w-full py-2 bg-primary text-white rounded transition duration-300 hover:bg-secondary"
            >
                Thêm vào giỏ hàng
            </button>
          </Link>

          {/* Remove Favorite Button */}
          <div className="text-gray-600 cursor-pointer hover:text-primary" onClick={() => handleRemoveFavorite(item._id)}>
            <FontAwesomeIcon icon={faTrash} />
          </div>
        </div>
      )) : <p>Chưa có sản phẩm yêu thích</p>}
    </div>
  );
};

export default FavoriteList;
