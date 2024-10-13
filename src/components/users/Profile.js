import React, { useState } from 'react';
// import { useState, useEffect} from 'react';
import { useUserContext } from '../context/UserContext';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PersonalInfo from './PersonalInfo';
import AddressSelector from './AddressAll';
// import UserOrders from './UserOrders';
import OrderPending from './OrderPending';
import OrderDelivered from './OrderDelivered';
import OrderCanceled from './OrderCancel';
import OrderProcessing from './OrderProcessing';
import OrderShipping from './OrderShipping';

const Profile = () => {
  const { user } = useUserContext();
  const [activeTab, setActiveTab] = useState('personalInfo');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
      
      {/* Layout with responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-md p-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0">
                <img 
                  src="../assets/images/avatar_user.jpg" 
                  alt="profile"
                  className="rounded-full w-16 h-16 border border-gray-200 p-1 object-cover" 
                />
              </div>
              <div>
                <p className="text-gray-600">Chào,</p>
                <h4 className="text-gray-800 font-medium">{user?.fullName || 'Guest'}</h4>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                  Quản lý tài khoản
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'personalInfo' ? 'text-primary' : 'text-gray-600'} transition`}
                  onClick={() => setActiveTab('personalInfo')}
                >
                  Thông tin tài khoản
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'address' ? 'text-primary' : 'text-gray-600'} transition`}
                  onClick={() => setActiveTab('address')}
                >
                  Quản lý địa chỉ
                </a>
                <a href="#" className="block text-gray-600 hover:text-primary transition">
                  Đổi mật khẩu
                </a>
              </div>

              <div className="pt-4 space-y-1">
                <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                  Lịch sử đơn hàng
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'pending' ? 'text-primary' : 'text-gray-600'} transition`}
                  onClick={() => setActiveTab('pending')}
                >
                  Chờ xử lý
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'processing' ? 'text-primary' : 'text-gray-600'} transition`}
                  onClick={() => setActiveTab('processing')}
                >
                  Đang xử lý
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'shipping' ? 'text-primary' : 'text-gray-600'} transition`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Đang vận chuyển
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'delivered' ? 'text-primary' : 'text-gray-600'} transition`}
                  onClick={() => setActiveTab('delivered')}
                >
                  Đã giao
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'canceled' ? 'text-primary' : 'text-gray-600'} transition`}
                  onClick={() => setActiveTab('canceled')}
                >
                  Đã hủy
                </a>
                {/* <a href="#" className="block text-gray-600 hover:text-primary transition">
                  Đánh giá của bạn
                </a> */}
              </div>

              <div className="pt-4 space-y-1">
                <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                  Phương thức thanh toán
                </a>
                <a href="#" className="block text-gray-600 hover:text-primary transition">
                  Voucher
                </a>
              </div>

              {/* <div className="pt-4 space-y-1">
                <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                  My wishlist
                </a>
              </div> */}

              {/* <div className="pt-4 space-y-1">
                <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                  Logout
                </a>
              </div> */}
            </div>
          </div>
        </div>
        {/* ./Sidebar */}
        <div className="md:col-span-2">
          {activeTab === 'personalInfo' && <PersonalInfo />}
          {activeTab === 'address' && <AddressSelector />}
          {activeTab === 'pending' && <OrderPending />} {/* Hiển thị đơn hàng */}
          {activeTab === 'processing' && <OrderProcessing />} {/* Hiển thị đơn hàng */}
          {activeTab === 'shipping' && <OrderShipping />} {/* Hiển thị đơn hàng */}
          {activeTab === 'delivered' && <OrderDelivered />} {/* Hiển thị đơn hàng */}
          {activeTab === 'canceled' && <OrderCanceled />} {/* Hiển thị đơn hàng */}          
        </div>
      </div>
    </div>
  );
};

export default Profile;
