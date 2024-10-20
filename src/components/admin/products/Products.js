import React, { useState } from 'react';
import ProductForm from './ProductForm';
import AllProducts from './AllProducts';
import ProductEditForm from './ProductEditForm';

function Products() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('allProducts');

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setActiveTab('editProduct');
  };

  const handleSuccess = () => {
    setSelectedProduct(null);
  };

  const handleChangeTab = (info) => {
    setActiveTab(info);
  }
  return (
    <div>    
      <button className='ml-8' onClick={() => handleChangeTab('addProduct')}>Thêm sản phẩm</button>
      {/* <button className='ml-8' onClick={() => handleChangeTab('editProduct')}>Chỉnh sửa sản phẩm</button> */}
      <button className='ml-8' onClick={() => handleChangeTab('allProducts')}>Danh sách sản phẩm</button>
      {activeTab === 'allProducts' && <AllProducts onEdit={handleEditProduct}/>}
      {activeTab === 'addProduct' && <ProductForm />}
      {activeTab === 'editProduct' && <ProductEditForm selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}/>}
    </div>
  );
}

export default Products;
