import React, { useState } from 'react';
// import axios from 'axios';
// import QuantitySelector from './QuantitySelector';
import { useCartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

const AddToCartButton = ({ userId, productId, quantity, size, color }) => {                     //{ productId, userId }

    const { addToCart } = useCartContext();

    // Hàm xử lý thêm vào giỏ hàng
    const handleAddToCart = () => {
        if(!userId){
            toast.info("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!", {
                position: "top-right",
                autoClose: 3000, 
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            return;
        }
        if (!color || !size) {
            toast.error("Vui lòng chọn màu sắc và kích thước trước khi tăng số lượng!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
              return;
        }
        addToCart(userId, productId, quantity, size, color);  // Gọi API thêm vào giỏ hàng
    };

    return (
        <div>
        {/* <QuantitySelector onQuantityChange={handleQuantityChange} /> */}
        <button 
            onClick={handleAddToCart}
            className="mt-2 w-full py-2 bg-primary text-white rounded transition duration-300 hover:bg-secondary"
        >
            Thêm vào giỏ hàng
        </button>
        </div>
    );
};

export default AddToCartButton;
