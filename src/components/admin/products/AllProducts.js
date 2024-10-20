import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../../common/Pagination';

const AllProducts = ({ onEdit }) => {
  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [ordersPerPage] = useState(3); // Số đơn hàng trên mỗi trang

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
          product._id === response.data.product._id 
            ? { ...product, isDeleted: !product.isDeleted } // Chỉ cập nhật trường isDeleted
            : product
        )
      );
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // const colorMapping = {
  //   'Đỏ': '#FF0000',
  //   'Xanh': '#00FF00',
  //   'Xanh dương': '#0000FF',
  //   'Xanh biển': '#008B8B',
  //   'Xanh nhạt': '#00CED1',
  //   'Vàng': '#FFFF00',
  //   'Vàng nhạt': '#FFFACD',
  //   'Xám': '#808080',
  //   'Đen': '#000000',
  //   'Trắng': '#FFFFFF',
  //   'Nâu': '#A52A2A',
  //   'Hồng': '#FFC0CB',
  //   'Tím': '#800080',
  // };

  // Tính toán trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = products.slice(indexOfFirstOrder, indexOfLastOrder); // Lấy danh sách đơn hàng hiện tại
  const totalPages = Math.ceil(products.length / ordersPerPage); // Tổng số trang

  return (
    <div>
      <h1 className='text-2xl text-center mb-6'>Danh sách sản phẩm</h1>
      <ul>
        {currentOrders.map((product) => (
          <li key={product._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <img 
              src={product.image || 'https://via.placeholder.com/100'} 
              alt={product.name} 
              style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
            />
            <div>
              <strong>{product.name}</strong> - {product.price} VND
              {/* <p><em dangerouslySetInnerHTML={{ __html: product.description || 'Không có mô tả' }} /></p> */}
              <p>Danh mục: {product.category.name || 'Không có danh mục'}</p>
              <p>Tình trạng: {product.isDeleted === true ? 'Đã tạm ẩn' : 'Đang bán'}</p>

              {/* <h4>Biến thể:</h4>
              <ul>
                {product.variants.map((variant, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span>Màu:</span>
                    <label
                      htmlFor={variant.color}
                      className="border border-gray-200 rounded-sm h-6 w-6 cursor-pointer shadow-sm block"
                      style={{ backgroundColor: colorMapping[variant.color] }}
                    ></label>
                    <span>, Size: {variant.size}</span>
                    <span>, Tồn kho: {variant.stock}</span>
                  </li>
                ))}
              </ul> */}

              <button 
                className="mt-2 bg-blue-600 text-white py-2 px-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
                onClick={() => onEdit(product)}
              >
                Chỉnh sửa
              </button>
              {product.isDeleted === true ? 
              (<button 
                className="mt- 2 ml-1 bg-green-600 text-white py-2 px-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" 
                onClick={() => handleDelete(product._id)}
              >
                Mở bán
              </button>) :
              (<button 
                className="mt- 2 ml-1 bg-red-600 text-white py-2 px-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" 
                onClick={() => handleDelete(product._id)}
              >
                Ẩn
              </button>)
              }
            </div>
          </li>
        ))}
      </ul>
      <Pagination 
        totalPages={totalPages}
        currentPage={currentPage}
        paginate={(pageNumber) => setCurrentPage(pageNumber)} // Cập nhật trang hiện tại
      />
    </div>
  );
};

export default AllProducts;
