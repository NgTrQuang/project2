import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form tại đây
    console.log('Form submitted:', formData);
    // Có thể thêm logic gửi dữ liệu đến API hoặc gửi email
    alert('Cảm ơn bạn đã liên hệ với chúng tôi!');
    setFormData({ name: '', email: '', phone: '', message: '' }); // Reset form
  };

  return (
    <section className="bg-gray py-10" id="section4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h2>
        <p className="text-lg mb-6">
          Chúng tôi luôn sẵn sàng lắng nghe ý kiến và phản hồi của bạn. 
          Vui lòng điền vào mẫu dưới đây và chúng tôi sẽ liên hệ lại sớm nhất có thể.
        </p>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow">
          <div className="mb-4">
            <label className="block text-left mb-1" htmlFor="name">Họ và Tên</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-left mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-left mb-1" htmlFor="phone">Số Điện Thoại</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-left mb-1" htmlFor="message">Tin Nhắn</label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Gửi
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
