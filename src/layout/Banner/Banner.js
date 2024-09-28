import React from 'react';

const Banner = () => {
  return (
    <div
      className="bg-cover bg-no-repeat bg-center py-36"
      style={{ backgroundImage: "url('assets/images/banner.jpeg')" }}
    >
      <div className="container">
        <h1 className="text-6xl text-gray-800 font-medium mb-4 capitalize">
          Bộ sưu tập tuyệt nhất <br /> dành cho bạn
        </h1>
        <p>
          Chào mừng, hãy đến với chúng tôi có trải nghiệm tuyệt vời và thú vị <br />
          Nơi dành cho đam mê thời trang có cùng sở thích với bạn.
        </p>
        <div className="mt-12">
          <a
            href="/products"
            className="bg-primary border border-primary text-white px-8 py-3 font-medium rounded-md hover:bg-transparent hover:text-primary"
          >
            Mua ngay
          </a>
        </div>
      </div>
    </div>
  );
};

export default Banner;
