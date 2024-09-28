import React, { useState } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

function Products() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleSuccess = () => {
    setSelectedProduct(null);
  };

  return (
    <div>
      <ProductForm selectedProduct={selectedProduct} onSuccess={handleSuccess} />
      <ProductList onEdit={handleEditProduct} />
    </div>
  );
}

export default Products;
