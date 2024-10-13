import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {  
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products/current'); // Đường dẫn API để lấy sản phẩm
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProductContext.Provider value={{ products, products: filteredProducts, setProducts, searchTerm, setSearchTerm, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

// export { ProductContext, ProductProvider };
export const useProductContext = () => {
  return useContext(ProductContext);
};
