import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUserContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        username,
        password,
      });
      const userData = response.data.user;
      login(userData);
      // Assuming your backend returns the token and user info
      const { token, user } = response.data;

      // You can store the token in localStorage or context for future API calls
      localStorage.setItem('token', token);
      const successMessage = 'Đăng nhập thành công! Chào mừng, ' + user.username;
      setSuccess(successMessage);

      // Show success toast notification
      toast.success(successMessage, {
        position: "top-right",
        autoClose: 3000, // tự đóng sau 3 giây
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/'); 
      // Optionally, redirect the user or update the state to show user info
      console.log('Logged in user:', user);
    } catch (err) {
      let errorMessage = 'Đã xảy ra lỗi! Vui lòng thử lại.';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message;
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000, // tự đóng sau 3 giây
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        setError('Đã xảy ra lỗi! Vui lòng thử lại.');
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000, // tự đóng sau 3 giây
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  return (
    <div className="contain py-16">
      <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
        <h2 className="text-2xl uppercase font-medium mb-1">Login</h2>
        <p className="text-gray-600 mb-6 text-sm">welcome back customer</p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-2">
            <div>
              <label htmlFor="username" className="text-gray-600 mb-2 block">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-gray-600 mb-2 block">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                className="text-primary focus:ring-0 rounded-sm cursor-pointer"
              />
              <label htmlFor="remember" className="text-gray-600 ml-3 cursor-pointer">
                Nhớ mật khẩu
              </label>
            </div>
            <a href="#" className="text-primary">Quên mật khẩu</a>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        <div className="mt-6 flex justify-center relative">
          <div className="text-gray-600 uppercase px-3 bg-white z-10 relative">Đăng nhập với</div>
          <div className="absolute left-0 top-3 w-full border-b-2 border-gray-200"></div>
        </div>
        <div className="mt-4 flex gap-4">
          <a
            href="#"
            className="w-1/2 py-2 text-center text-white bg-blue-800 rounded uppercase font-roboto font-medium text-sm hover:bg-blue-700"
          >
            facebook
          </a>
          <a
            href="#"
            className="w-1/2 py-2 text-center text-white bg-red-600 rounded uppercase font-roboto font-medium text-sm hover:bg-red-500"
          >
            google
          </a>
        </div>

        <p className="mt-4 text-center text-gray-600">
          Chưa có tài khoản? <a href="/register" className="text-primary">Đăng ký ngay</a>
        </p>

        {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
        {/* {success && <p style={{ color: 'green' }}>{success}</p>} */}
      <ToastContainer/>
      </div>
    </div>
  );
};

export default Login;
