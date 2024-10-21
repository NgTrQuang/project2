import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../../components/context/ProductContext';

const Categories = () => {
  const categories = [
    { 
      src: 'assets/images/category/T-shirt.jpg', 
      alt: 'T-Shirt', 
      label: 'T-Shirt', 
      description: 'Áo thun là một lựa chọn lý tưởng cho mọi dịp, từ dạo phố cho đến các hoạt động thể thao. Chúng mang lại sự thoải mái và phong cách trẻ trung cho người mặc.' 
    },
    { 
      src: 'assets/images/category/jean.jpg', 
      alt: 'Jean', 
      label: 'Jean', 
      description: 'Quần jean không bao giờ lỗi mốt và luôn là sự lựa chọn hàng đầu cho mọi phong cách. Chúng phù hợp với nhiều loại áo và giày, tạo nên nhiều phong cách khác nhau từ casual đến lịch sự.' 
    },
    { 
      src: 'assets/images/category/hoodies.jpg', 
      alt: 'Hoodies', 
      label: 'Hoodies', 
      description: 'Hoodies là trang phục hoàn hảo cho những ngày lạnh. Chúng mang lại cảm giác ấm áp và dễ dàng phối hợp với nhiều trang phục khác nhau, từ quần jogger đến quần jeans.' 
    },
    { 
      src: 'assets/images/category/so-mi.jpg', 
      alt: 'Sơ mi', 
      label: 'Sơ mi', 
      description: 'Sơ mi là một món đồ thời trang không thể thiếu trong tủ đồ của mọi người. Chúng phù hợp cho môi trường công sở và cũng có thể được mặc trong các buổi tiệc, giúp bạn luôn nổi bật.' 
    },
    { 
      src: 'assets/images/category/the-thao.jpg', 
      alt: 'Thể thao', 
      label: 'Thể thao', 
      description: 'Trang phục thể thao được thiết kế để mang lại sự thoải mái và linh hoạt trong các hoạt động thể chất. Chúng giúp bạn vận động dễ dàng hơn và giữ cho bạn luôn thoải mái trong suốt quá trình tập luyện.' 
    },
    { 
      src: 'assets/images/category/short.png', 
      alt: 'Short', 
      label: 'Short', 
      description: 'Short là lựa chọn tuyệt vời cho mùa hè. Chúng giúp bạn cảm thấy mát mẻ và thoải mái trong những ngày nắng nóng. Có nhiều kiểu dáng và màu sắc để bạn lựa chọn.' 
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
            <div className="md:w-1/2">
              <img src={category.src} alt={category.alt} className="w-full h-100 object-cover" />
            </div>
            <div className="md:w-1/2 p-4 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-gray-800">{category.label}</h3>
              <p className="text-gray-600 mb-2">{category.description}</p>
              <a
                onClick={() => handleCategoryClick(categoriesMapping[index])}
                className="inline-block mt-2 text-primary font-medium hover:underline"
              >
                Xem sản phẩm
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
