import React from 'react';

const Categories = () => {
  const categories = [
    { src: 'assets/images/category/T-shirt.jpg', alt: 'T-Shirt', label: 'T-Shirt' },
    { src: 'assets/images/category/jean.jpg', alt: 'Jean', label: 'Jean' },
    { src: 'assets/images/category/hoodies.jpg', alt: 'Hoodies', label: 'Hoodies' },
    { src: 'assets/images/category/so-mi.jpg', alt: 'Sơ mi', label: 'Sơ mi' },
    { src: 'assets/images/category/the-thao.jpg', alt: 'Thể thao', label: 'Thể thao' },
    { src: 'assets/images/category/short.png', alt: 'Short', label: 'Short' },
  ];

  return (
    <div className="container py-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">Mua sắm với danh mục</h2>
      <div className="grid grid-cols-3 gap-3">
        {categories.map((category, index) => (
          <div key={index} className="relative rounded-sm overflow-hidden group">
            <img src={category.src} alt={category.alt} className="w-full" />
            <a
              href="#"
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
