import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../../components/context/ProductContext';

const Categories = () => {
  const categories = [
    { 
      src: 'assets/images/category/ao_thun.jpg', 
      alt: 'Áo thun', 
      label: 'Áo thun', 
      description: 'Áo thun đa dụng và dễ phối, phù hợp cho cả dạo phố và hoạt động thể thao nhẹ. Với chất liệu thoáng mát, đây là lựa chọn không thể thiếu cho phong cách năng động.' 
    },
    { 
      src: 'assets/images/category/polo.jpg', 
      alt: 'Polo', 
      label: 'Polo', 
      description: 'Áo polo vừa lịch sự vừa năng động, là lựa chọn lý tưởng cho các hoạt động thể thao hoặc gặp gỡ. Thiết kế cổ gập mang lại vẻ chỉnh chu nhưng vẫn thoải mái khi di chuyển.' 
    },
    { 
      src: 'assets/images/category/ao_khoac.jpg', 
      alt: 'Áo khoác thể thao', 
      label: 'Áo khoác thể thao', 
      description: 'Áo khoác thể thao giữ ấm và linh hoạt cho mọi hoàn cảnh, từ luyện tập ngoài trời đến những buổi dạo phố. Với chất liệu mềm mại và kiểu dáng khỏe khoắn, áo khoác thể thao luôn là sự lựa chọn đa năng.' 
    },
    { 
      src: 'assets/images/category/quan_dai.jpg', 
      alt: 'Quần dài', 
      label: 'Quần dài', 
      description: 'Quần dài giúp bạn cân bằng giữa phong cách trẻ trung và năng động. Thiết kế tinh tế theo thiên hướng thể thao và dễ phối hợp với áo thun hay áo polo, quần dài sẽ là lựa chọn đem lại sự linh hoạt cho nhiều hoạt động.' 
    },
    { 
      src: 'assets/images/category/the-thao.jpg', 
      alt: 'Combo bộ quần áo thể thao', 
      label: 'Combo bộ quần áo thể thao', 
      description: 'Combo bộ quần áo thể thao giúp bạn thoải mái tối đa khi vận động. Với chất liệu co giãn và thấm hút mồ hôi, combo quần áo thể thao mang đến sự linh hoạt và phong cách năng động đáng để bạn trải nghiệm.' 
    },
    { 
      src: 'assets/images/category/quan_short.jpg', 
      alt: 'Short', 
      label: 'Short', 
      description: 'Quần Short mang lại sự mát mẻ và dễ chịu cho ngày hè, phù hợp cho cả hoạt động thể thao và vui chơi ngoài trời. Kiểu dáng gọn nhẹ và linh hoạt cho mọi hoạt động.' 
    },    
  ];

  const { setProducts } = useProductContext();
  const navigate = useNavigate();

  const handleCategoryClick = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products/category?category=${categoryId}`);
      console.log('Danh sách sản phẩm:', response.data);
      setProducts(response.data);
      navigate('/products');
    } catch (error) {
      console.error('Lỗi khi tìm kiếm sản phẩm:', error);
    }
  };

  const categoriesMapping = {
    0: '66f7c5b8d3de0bcc1cdbf6ef',
    1: '66f7c5b8d3de0bcc1cdbf6f0',
    2: '66f7c5b8d3de0bcc1cdbf6f1',
    3: '66f7c5b8d3de0bcc1cdbf6f2',
    4: '66f7c5b8d3de0bcc1cdbf6f3',
    5: '66f7c5b8d3de0bcc1cdbf6f4',
  };

  return (
    <div className="container py-16" id="section2">
      <div className="grid grid-cols-1 gap-6">
        {categories.map((category, index) => (
          <div key={index} className={`flex flex-col md:flex-row bg-gray-50 rounded-md overflow-hidden group p-4 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            <div className="md:w-1/2 flex justify-center items-center">
              <img src={category.src} alt={category.alt} className="w-64 h-64 object-cover" />
            </div>
            <div className="md:w-1/2 p-4 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-gray-800">{category.label}</h3>
              <p className="text-gray-600 mb-2">{category.description}</p>
              <button
                onClick={() => handleCategoryClick(categoriesMapping[index])}
                className="inline-block mt-2 text-primary font-medium hover:underline"
              >
                Xem sản phẩm
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
