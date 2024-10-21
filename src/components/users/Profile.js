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
import UserList from '../admin/users/UserList';
import OrderAllPending from '../admin/orders/OrderAllPending';
import OrderAllProcessing from '../admin/orders/OrderAllProcessing';
import OrderAllShipping from '../admin/orders/OrderAllShipping';
import OrderAllDelivered from '../admin/orders/OrderAllDelivered';
import OrderAllCancel from '../admin/orders/OrderAllCancel';
import OrderListPage from '../admin/orders/OrderListPage';
import Products from '../admin/products/Products';
import Statistics from '../admin/statistics/Statistics';

const Profile = () => {
  const { user } = useUserContext();
  const [activeTab, setActiveTab] = useState('personalInfo');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
      
      {/* Layout with responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-yellow-50 shadow-md rounded-md p-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-shrink-0">
                <img 
                  src="../assets/images/avatar_user.jpg" 
                  alt="profile"
                  className="rounded-full w-16 h-16 border border-gray-200 p-1 object-cover" 
                />
              </div>
              <div>
                <p className="text-gray-500">Chào,</p>
                <h4 className="text-xl font-semibold text-gray-800">{user?.fullName || 'Guest'}</h4>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                  Quản lý tài khoản
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'personalInfo' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                  onClick={() => setActiveTab('personalInfo')}
                >
                  Thông tin tài khoản
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'address' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                  onClick={() => setActiveTab('address')}
                >
                  Quản lý địa chỉ
                </a>
                <a href="#" className="block text-gray-600 hover:text-primary transition ml-6">
                  Đổi mật khẩu
                </a>
              </div>

              <div className="pt-4 space-y-1">
                <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                  Lịch sử đơn hàng
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'pending' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                  onClick={() => setActiveTab('pending')}
                >
                  Chờ xử lý
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'processing' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                  onClick={() => setActiveTab('processing')}
                >
                  Đã xác nhận
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'shipping' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Đang vận chuyển
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'delivered' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                  onClick={() => setActiveTab('delivered')}
                >
                  Đã giao
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'canceled' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                  onClick={() => setActiveTab('canceled')}
                >
                  Đã hủy
                </a>
                {/* <a href="#" className="block text-gray-600 hover:text-primary transition">
                  Đánh giá của bạn
                </a> */}
              </div>
              {/* ADMIN */}
              {user?.role === 'admin' &&
              <>
                <div className="pt-4 space-y-1">
                  <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                    Quản lý người dùng
                  </a>
                  <a 
                    href="#" 
                    className={`block ${activeTab === 'manageUser' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                    onClick={() => setActiveTab('manageUser')}
                  >
                    Danh sách người dùng
                  </a>
                </div>
                <div className="pt-4 space-y-1">
                  <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                    Quản lý sản phẩm
                  </a>
                  <a 
                    href="#" 
                    className={`block ${activeTab === 'manageProduct' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                    onClick={() => setActiveTab('manageProduct')}
                  >
                    Danh sách sản phẩm
                  </a>
                </div>
                <div className="pt-4 space-y-1">
                  <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                    Quản lý đơn hàng
                  </a>
                  <a 
                    href="#" 
                    className={`block ${activeTab === 'manageOrder' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                    onClick={() => setActiveTab('manageOrder')}
                  >
                    Tất cả các đơn hàng
                  </a>
                  <a 
                    href="#" 
                    className={`block ${activeTab === 'manageOrderPending' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                    onClick={() => setActiveTab('manageOrderPending')}
                  >
                    Đơn hàng chờ xử lý
                  </a>
                  <a 
                    href="#" 
                    className={`block ${activeTab === 'manageOrderProcessing' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                    onClick={() => setActiveTab('manageOrderProcessing')}
                  >
                    Đơn hàng đã xác nhận
                  </a>
                  <a 
                    href="#" 
                    className={`block ${activeTab === 'manageOrderShipping' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                    onClick={() => setActiveTab('manageOrderShipping')}
                  >
                    Đơn hàng đang vận chuyển
                  </a>
                  <a 
                    href="#" 
                    className={`block ${activeTab === 'manageOrderDelivered' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                    onClick={() => setActiveTab('manageOrderDelivered')}
                  >
                    Đơn hàng đã giao
                  </a>
                  <a 
                    href="#" 
                    className={`block ${activeTab === 'manageOrderCanceled' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                    onClick={() => setActiveTab('manageOrderCanceled')}
                  >
                    Đơn hàng đã hủy
                  </a>
                </div>
                <div className="pt-4 space-y-1">
                  <a href="#" className="block font-medium text-gray-700 hover:text-primary transition">
                    Báo cáo thống kê
                  </a>
                  <a 
                    href="#" 
                    className={`block ${activeTab === 'statistics' ? 'text-primary' : 'text-gray-600'} transition ml-6`}
                    onClick={() => setActiveTab('statistics')}
                  >
                    Thống kê
                  </a>
                </div>
              </>
              }
              {/* ADMIN */}

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

          {activeTab === 'manageUser' && <UserList />} {/* Hiển thị đơn hàng */} 

          {activeTab === 'manageProduct' && <Products />} {/* Hiển thị đơn hàng */}     

          {activeTab === 'manageOrder' && <OrderListPage />} {/* Hiển thị đơn hàng */}  
          {activeTab === 'manageOrderPending' && <OrderAllPending />} {/* Hiển thị đơn hàng */}  
          {activeTab === 'manageOrderProcessing' && <OrderAllProcessing />} {/* Hiển thị đơn hàng */}  
          {activeTab === 'manageOrderShipping' && <OrderAllShipping />} {/* Hiển thị đơn hàng */}  
          {activeTab === 'manageOrderDelivered' && <OrderAllDelivered />} {/* Hiển thị đơn hàng */}
          {activeTab === 'manageOrderCanceled' && <OrderAllCancel />} {/* Hiển thị đơn hàng */}     

          {activeTab === 'statistics' && <Statistics />} {/* Hiển thị đơn hàng */}  
        </div>
      </div>
    </div>
  );
};

export default Profile;
