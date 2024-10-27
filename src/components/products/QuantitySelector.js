import React, { useState, useEffect } from 'react';
// import { useCartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

const QuantitySelector = ({ quantity, onQuantityChange, onRemove, selectedColor, selectedSize, selectedProduct }) => {
  const [availableStock, setAvailableStock] = useState(0);

  useEffect(() => {
    setAvailableStock(getAvailableStock());
  }, [selectedColor, selectedSize, selectedProduct]);

  const handleIncrease = () => {
    if (!selectedColor || !selectedSize) {
      if (!toast.isActive('color-size-error')) {
      toast.error("Vui lòng chọn màu sắc và kích thước trước khi tăng số lượng!", {
        toastId: 'color-size-error',
      });
      return;
      }
    }
    if (quantity < availableStock) { // Giới hạn số lượng tối đa
      onQuantityChange(quantity + 1);
    } else{
      if (!toast.isActive('stock-error')) {
      toast.error("Sản phẩm vượt quá giới hạn trong kho!", {
        toastId: 'stock-error',
      });
      }
    }
  };

  const getAvailableStock = () => {
    // Tìm variant có cùng màu và size mà người dùng đã chọn
    const variant = selectedProduct?.variants.find(
      (variant) => variant?.color === selectedColor && variant?.size === selectedSize
    );
    return variant ? variant?.stock : 0; // Trả về stock của variant hoặc 0 nếu không tìm thấy
  };

  const handleDecrease = () => {
    if (quantity > 1) {
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
