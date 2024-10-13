import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../../components/context/ProductContext';

const Categories = () => {
  const categories = [
    { src: 'assets/images/category/T-shirt.jpg', alt: 'T-Shirt', label: 'T-Shirt' },
    { src: 'assets/images/category/jean.jpg', alt: 'Jean', label: 'Jean' },
    { src: 'assets/images/category/hoodies.jpg', alt: 'Hoodies', label: 'Hoodies' },
    { src: 'assets/images/category/so-mi.jpg', alt: 'Sơ mi', label: 'Sơ mi' },
    { src: 'assets/images/category/the-thao.jpg', alt: 'Thể thao', label: 'Thể thao' },
    { src: 'assets/images/category/short.png', alt: 'Short', label: 'Short' },
  ];

  const { setProducts } = useProductContext();

  const navigate = useNavigate();

  const handleCategoryClick = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products/category?category=${categoryId}`);
      console.log('Danh sách sản phẩm:', response.data); // Kiểm tra dữ liệu trả về
      // navigate(`/products?category=${categoryId}`);
      setProducts(response.data);
      navigate('/products');
    } catch (error) {
      console.error('Lỗi khi tìm kiếm sản phẩm:', error);
    }
  };

  const categoriesMapinng = {
    0: '66f7c5b8d3de0bcc1cdbf6ef',
    1: '66f7c5b8d3de0bcc1cdbf6f0',
    2: '66f7c5b8d3de0bcc1cdbf6f1',
    3: '66f7c5b8d3de0bcc1cdbf6f2',
    4: '66f7c5b8d3de0bcc1cdbf6f3',
    5: '66f7c5b8d3de0bcc1cdbf6f4',
  }

  return (
    <div className="container py-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">Mua sắm với danh mục</h2>
      <div className="grid grid-cols-3 gap-3">
        {categories.map((category, index) => (
          <div key={index} className="relative rounded-sm overflow-hidden group">
            <img src={category.src} alt={category.alt} className="w-full" />
            <a
              onClick={() => handleCategoryClick(categoriesMapinng[index])}
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
            >
              {category.label}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
