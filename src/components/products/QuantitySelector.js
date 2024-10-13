import React, { useState } from 'react';
import { useCartContext } from '../context/CartContext';

const QuantitySelector = ({ quantity, onQuantityChange, onRemove, selectedColor, selectedSize, selectedProduct }) => {
  // const [quantity, setQuantity] = useState(1);
  // const { quantity, setQuantity } = useCartContext();
// console.log(selectedColor);
// console.log(selectedSize);
// console.log(selectedProduct);

  const handleIncrease = () => {
    if (quantity < getAvailableStock()) { // Giới hạn số lượng tối đa
      onQuantityChange(quantity + 1);
    }
  };

  const getAvailableStock = () => {
    // Tìm variant có cùng màu và size mà người dùng đã chọn
    const variant = selectedProduct.variants.find(
      (variant) => variant.color === selectedColor && variant.size === selectedSize
    );
    return variant ? variant.stock : 0; // Trả về stock của variant hoặc 0 nếu không tìm thấy
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      // setQuantity(prev => prev - 1);
      onQuantityChange(quantity - 1);
    } else if (quantity === 1 && onRemove) {
      onRemove(); // Gọi hàm xóa khi số lượng về 0
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button 
        onClick={handleDecrease} 
        className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded"
      >-</button>
      <span>{quantity}</span>
      <button 
        onClick={handleIncrease} 
        className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded"
      >+</button>
    </div>
  );
};

export default QuantitySelector;
