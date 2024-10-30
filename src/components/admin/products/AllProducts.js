import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../../common/Pagination';

const AllProducts = ({ onEdit }) => {
  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [productsPerPage] = useState(3); // Số đơn hàng trên mỗi trang

  // Lấy danh sách sản phẩm khi component được render
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products/');
      console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/products/${id}`);
      setProducts((prevProducts) => 
        prevProducts.map((product) => 
          product._id === response.data?.product?._id 
            ? { ...product, isDeleted: !product?.isDeleted } // Chỉ cập nhật trường isDeleted
            : product
        )
      );
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Tính toán trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct); // Lấy danh sách product hiện tại
  const totalPages = Math.ceil(products.length / productsPerPage); // Tổng số trang

  return (
    <div>
      <h1 className='text-2xl text-center mb-6'>Danh sách sản phẩm</h1>
      <ul 
        style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px', 
          listStyle: 'none', 
          padding: 0
        }}
      >
        {currentProducts.map((product) => (
          <li 
            key={product?._id} 
            style={{ 
              border: '1px solid #ccc', 
              padding: '10px', 
              // marginBottom: '10px' 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}
          >
            <img 
              src={product?.image || 'https://via.placeholder.com/100'} 
              alt={product?.name} 
              style={{ width: '200px', height: '200px', objectFit: 'cover' }} 
            />
            <div>
              <strong>{product?.name}</strong> - {product?.price.toLocaleString()} VND
              {/* <p><em dangerouslySetInnerHTML={{ __html: product.description || 'Không có mô tả' }} /></p> */}
              <p>Danh mục: {product?.category?.name || 'Không có danh mục'}</p>
              <p>Tình trạng: {product?.isDeleted === true ? 'Đã tạm ẩn' : 'Đang bán'}</p>

              {/* <h4>Biến thể:</h4>
              <ul>
                {product?.variants.map((variant, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span>Màu:</span>
                    <label
                      htmlFor={variant?.color}
                      className="border border-gray-200 rounded-sm h-6 w-6 cursor-pointer shadow-sm block"
                      style={{ backgroundColor: colorMapping[variant?.color] }}
                    ></label>
                    <span>, Size: {variant?.size}</span>
                    <span>, Tồn kho: {variant?.stock}</span>
                  </li>
                ))}
              </ul> */}

              <button 
                className="mt-2 bg-blue-600 text-white py-2 px-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
                onClick={() => onEdit(product)}
              >
                <i class="fa-solid fa-pen-to-square"></i>{/* Chỉnh sửa */}
              </button>
              {product?.isDeleted === true ? 
              (<button 
                className="mt- 2 ml-1 bg-green-600 text-white py-2 px-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" 
                onClick={() => handleDelete(product?._id)}
              >
                Mở bán
              </button>) :
              (<button 
                className="mt- 2 ml-1 bg-red-600 text-white py-2 px-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" 
                onClick={() => handleDelete(product?._id)}
              >
                <i class="fa-solid fa-eye-slash"></i>{/* Ẩn */}
              </button>)
              }
            </div>
          </li>
        ))}
      </ul>
      {totalPages && 
        <Pagination 
          totalPages={totalPages}
          currentPage={currentPage}
          paginate={(pageNumber) => setCurrentPage(pageNumber)} // Cập nhật trang hiện tại
        />
      }
    </div>
  );
};

export default AllProducts;
