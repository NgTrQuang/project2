import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../../common/Pagination';
import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

const LowStockProducts = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [productsPerPage] = useState(6); // Số đơn hàng trên mỗi trang

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/statistics/products/low-stock'); // Thay bằng URL API của bạn
        setLowStockProducts(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm tồn kho thấp:', error);
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  const colorMapping = {
    'Đỏ': '#FF0000',
    'Xanh': '#00FF00',
    'Xanh dương': '#0000FF',
    'Xanh biển': '#008B8B',
    'Xanh nhạt': '#00CED1',
    'Vàng': '#FFFF00',
    'Vàng nhạt': '#FFFACD',
    'Xám': '#808080',
    'Đen': '#000000',
    'Trắng': '#FFFFFF',
    'Nâu': '#A52A2A',
    'Hồng': '#FFC0CB',
    'Tím': '#800080',
    'Cam': '#FFA500',           
    'Xanh lá cây': '#228B22',   
    'Xanh quân đội': '#556B2F', 
    'Be': '#F5F5DC',            
    'Vàng chanh': '#FFD700',    
    'Xanh ngọc': '#40E0D0',     
    'Bạc': '#C0C0C0',          
    'Xanh rêu': '#6B8E23',      
    'Xanh navy': '#000080',     
    'Đỏ rượu': '#8B0000',       
    'Vàng cam': '#FFCC00',      
    'Xanh olive': '#808000',   
    'Xanh mint': '#98FF98',     
    'Tím nhạt': '#D8BFD8',      
    'Xanh lục nhạt': '#98FB98', 
    'Hồng phấn': '#FF69B4',    
    'Xanh pastel': '#B0E0E6',   
    'Đỏ tươi': '#FF4500',      
    'Xám tro': '#BEBEBE',
    'Tím than': '#4B0082',       
};

  // Tính toán trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProduct = lowStockProducts.slice(indexOfFirstProduct, indexOfLastProduct); // Lấy danh sách đơn hàng hiện tại
  const totalPages = Math.ceil(lowStockProducts.length / productsPerPage); // Tổng số trang

  // Chức năng tải file Excel
  const downloadExcel = () => {
    const data = lowStockProducts.map(product => ({
      'Tên sản phẩm': product?.name,
      'Giá (VND)': product?.price.toLocaleString(),
      'Màu': product?.variants?.color,
      'Size': product?.variants?.size,
      'Còn lại': product?.variants?.stock,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sản phẩm tồn kho thấp');

    XLSX.writeFile(wb, 'low_stock_products.xlsx');
  };

return (
    <div>
      <h2 className='mt-4 text-2xl font-medium'>Sản phẩm tồn kho thấp</h2>
      {lowStockProducts.length === 0 ? (
          <p>Không có sản phẩm nào có tồn kho thấp.</p>
      ) : (
      <table className='table-auto w-full text-center'>
          <thead>
              <tr>
              <th className="py-2 px-4 border">Tên sản phẩm</th>
              {/* <th className="py-2 px-4 border">Hình ảnh</th> */}
              <th className="py-2 px-4 border">Giá (VND)</th>
              <th className="py-2 px-4 border">Màu</th>
              <th className="py-2 px-4 border">Size</th>
              <th className="py-2 px-4 border">Còn lại</th>
              </tr>
          </thead>
          <tbody>
              {currentProduct.map((product, index) => (
              <tr key={index}>
                  <td className="py-2 px-4 border">{product?.name}</td>
                  {/* <td className="py-2 px-4 border">
                  <img 
                      src={product?.image.length > 0 ? product?.image[0] : product?.image} 
                      alt={product?.name} 
                      width={100} 
                  />
                  </td> */}
                  <td className="py-2 px-4 border">{product?.price.toLocaleString()}</td>
                  <td className="py-2 px-4 border">
                      <span
                      className="inline-block mt-3 border border-gray-200 rounded-sm cursor-pointer shadow-sm"
                      style={{
                          width: product?.variants?.color ? '24px' : '0', 
                          height: product?.variants?.color ? '24px' : '0',
                          backgroundColor: product?.variants?.color ? colorMapping[product?.variants?.color] : 'transparent',
                      }}
                      ></span>
                  </td>
                  <td className="py-2 px-4 border">{product?.variants?.size}</td>
                  <td className="py-2 px-4 border">{product?.variants?.stock}</td>
              </tr>
              ))}
          </tbody>
      </table>
    )}
    {totalPages > 1 &&
      <Pagination 
          totalPages={totalPages}
          currentPage={currentPage}
          paginate={(pageNumber) => setCurrentPage(pageNumber)} // Cập nhật trang hiện tại
      />
    }
    <button
      onClick={downloadExcel}
      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
    >
      Tải về Excel
    </button>
    </div>

  );
};

export default LowStockProducts;
