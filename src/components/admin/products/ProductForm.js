import axios from 'axios';
import React, { useState, useEffect } from 'react';
// import { addProduct, updateProduct } from '../api';

const ProductForm = ({ selectedProduct, onSuccess }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    size: [],
    color: [],
    stock: 0,
  });

  useEffect(() => {
    if (selectedProduct) {
      setProduct(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        // Cập nhật sản phẩm
        await axios.put(`http://localhost:3000/api/products/${selectedProduct._id}`, product);
      } else {
        // Thêm sản phẩm mới
        await axios.post(`http://localhost:3000/api/products/`, product);
      }
      onSuccess();
      setProduct({
        name: '',
        description: '',
        price: 0,
        category: '',
        size: [],
        color: [],
        stock: 0,
      });
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  return (
    <div>
      <h2>{selectedProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Tên sản phẩm"
          value={product.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Giá sản phẩm"
          value={product.price}
          onChange={handleChange}
          required
        />
        {/* Các trường khác như category, description, size, stock */}
        <button type="submit">{selectedProduct ? 'Cập nhật' : 'Thêm'}</button>
      </form>
    </div>
  );
};

export default ProductForm;
