import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [ cartItems, setCartItems ] = useState([]);
  // const [ quantity, setQuantity ] = useState(1);

  // Hàm gọi API để thêm sản phẩm vào giỏ hàng trong backend
  const addToCart = async (userId, productId, quantity, size, color) => {
    console.log('Adding to cart:', { userId, productId, quantity, size, color });
    try {
      const response = await axios.post('http://localhost:3000/api/cart', {
        userId,
        productId,
        quantity,
        size,
        color,
      });
      // Cập nhật trạng thái cartItems sau khi thêm thành công
      setCartItems(prevItems => {
        const existingProduct = prevItems.find(item => item?.productId === productId);

        if (existingProduct) {
          return prevItems.map(item =>
            item.productId === productId
              ? { ...item, quantity: item?.quantity + quantity }
              : item
          );
        } else {
          return [...prevItems, { productId, quantity }];
        }
      });
      toast.success("Thêm vào giỏ hàng thành công", {
        position: "top-right",
        autoClose: 3000, // tự đóng sau 3 giây
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log('Thêm vào giỏ hàng thành công:', response.data);
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
    }
  };

  // Hàm để cập nhật số lượng sản phẩm trong giỏ hàng
  // Hàm cập nhật giỏ hàng
  const updateCartItem = async (userId, cartItemId, color, size, quantity) => {
    try {
      const response = await axios.put('http://localhost:3000/api/cart/update', {
        userId,
        cartItemId,
        color,
        size,
        quantity
      });
      // Cập nhật lại giỏ hàng sau khi cập nhật
      setCartItems(response.data?.cart);
    } catch (error) {
      console.error('Lỗi khi cập nhật giỏ hàng:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, updateCartItem }}>
      {children}
    </CartContext.Provider>
  );
};
