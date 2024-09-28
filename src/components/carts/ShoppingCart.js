import React from 'react';

const ShoppingCart = ({ cartItems, onRemoveFromCart }) => {
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div>
      <h2>Giỏ hàng</h2>
      {cartItems.length === 0 ? (
        <p>Chưa có sản phẩm nào trong giỏ hàng.</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              <strong>{item.name}</strong> - {item.price} VND
              <button onClick={() => onRemoveFromCart(index)}>Xóa</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Tổng tiền: {totalPrice} VND</h3>
    </div>
  );
};

export default ShoppingCart;
