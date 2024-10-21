import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3000/api/register', {
        username,
        email,
        password,
        fullName,
        address,
        phoneNumber,
      });
      const successMessage = 'Đăng ký thành công! Vui lòng đăng nhập.'
      setSuccess(successMessage);
      toast.success(successMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Optionally clear the form or redirect the user
      setUsername('');
      setEmail('');
      setPassword('');
      setFullName('');
      setAddress('');
      setPhoneNumber('');
    } catch (err) {
        let errorMessage = err.response.data.message;
        if (err.response && err.response.data) {
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        } else {
        errorMessage = 'Đã xảy ra lỗi! Vui lòng thử lại.';
        setError('Đã xảy ra lỗi! Vui lòng thử lại');
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  return (
    <div className="contain py-16 bg-yellow-50">
      <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
        <h2 className="text-2xl font-medium mb-1">Đăng ký</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-2">
            <div>
              <label htmlFor="username" className="text-gray-600 mb-2 block">
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="text-gray-600 mb-2 block">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-gray-600 mb-2 block">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="fullName" className="text-gray-600 mb-2 block">
                Họ tên
              </label>
              <input
                type="text"
                id="fullName"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="Trần Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="text-gray-600 mb-2 block">
                Địa chỉ 
                <span className="text-yellow-500 ml-2 text-sm italic">
                  (Bạn nên nhập đúng địa chỉ vì đây là địa chỉ giao hàng trong tương lai của bạn!)
                </span>
              </label>
              <input
                type="text"
                id="address"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="123/6, đường 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="text-gray-600 mb-2 block">
                Số điện thoại
              </label>
              <input
                type="text"
                id="phoneNumber"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="0123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition font-medium"
            >
              Đăng ký
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Bạn đã có tài khoản? <a href="/login" className="text-primary">Đăng nhập ngay</a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
