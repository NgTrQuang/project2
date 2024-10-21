import React, { useEffect, useState } from 'react';

const Banner = () => {
  const images = [
    "assets/images/banner2.jpg",
    "assets/images/banner3.jpg",
    "assets/images/banner4.jpg",
    "assets/images/banner5.jpg",
    "assets/images/banner6.jpg"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Thay đổi hình ảnh mỗi 5 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [images.length]);

  return (
    <div
      className="bg-cover bg-no-repeat bg-center py-36"
      style={{ backgroundImage: `url('${images[currentImageIndex]}')` }}
    >
      <div className="container">
        <h1 className="text-6xl text-gray-800 font-medium mb-4 capitalize">
          Những sản phẩm độc đáo <br /> chỉ dành cho bạn
        </h1>
        <p>
          Chào mừng đến với chúng tôi để có trải nghiệm tuyệt vời và thú vị <br />
          Nơi dành cho đam mê thời trang và có cùng sở thích với bạn.
        </p>
        <div className="mt-12">
          <a
            href="/products"
            className="bg-green-600 border border-green text-black px-8 py-3 font-medium rounded-md hover:bg-transparent hover:text-green"
          >
            Mua ngay
          </a>
        </div>
      </div>
    </div>
  );
};

export default Banner;
