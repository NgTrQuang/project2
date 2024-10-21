import React from 'react';

const AboutUs = () => {
  return (
    <section className="bg-gray py-10" id="section3">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Chào Mừng Bạn Đến Với Shop Quần Áo Của Chúng Tôi!</h2>
        <p className="text-lg mb-6">
          Tại đây, chúng tôi cung cấp một bộ sưu tập quần áo phong phú và đa dạng và phong cách. 
          Từ những bộ trang phục hàng ngày cho đến những bộ đồ dự tiệc, bạn đều có thể tìm thấy 
          những món đồ phù hợp với nhu cầu của mình.
        </p>
        <img 
          src="assets/images/about-us.jpg" 
          alt="Giới thiệu về shop" 
          className="mx-auto mb-6 w-full max-w-lg rounded shadow-lg" 
        />
        <h3 className="text-xl font-semibold mb-2">Điểm Nổi Bật:</h3>
        <ul className="list-disc list-inside mb-4 text-left mx-auto max-w-md">
          <li>Các mẫu thiết kế độc đáo và hợp thời trang</li>
          <li>Chất liệu vải cao cấp và thân thiện với người sử dụng</li>
          <li>Giao hàng nhanh chóng và dịch vụ chăm sóc khách hàng tận tâm</li>
        </ul>
        <p className="text-lg">
          Hãy cùng khám phá bộ sưu tập của chúng tôi ngay hôm nay và tìm ra phong cách riêng của bạn!
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
