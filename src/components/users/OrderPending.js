import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext'; // Lấy thông tin người dùng từ context
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import Pagination from '../../common/Pagination';

const OrderPending = () => {
  const { userId, user } = useUserContext(); // Lấy thông tin người dùng từ context
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // const token = localStorage.getItem('token');

  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [ordersPerPage] = useState(3); // Số đơn hàng trên mỗi trang

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`http://localhost:3000/api/orders/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Thêm token vào header để xác thực
          }
        });

        if (response.status === 200) {
          setOrders(response.data);
          console.log(response.data);
        } else {
          toast.error("Không thể lấy danh sách đơn hàng.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error("Lỗi khi lấy danh sách đơn hàng.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return <div>Đang tải đơn hàng...</div>;
  }

  if (!user) {
    return <div>Bạn chưa đăng nhập.</div>;
  }

  if (orders.length === 0) {
    return <div>Bạn chưa có đơn hàng nào.</div>;
  }

  // Hàm để hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/orders/cancel-error/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Cập nhật trạng thái đơn hàng sau khi hủy đơn
      const updatedOrders = orders.map((order) =>
        order?._id === orderId ? { 
            ...order, 
            orderStatus: response.data?.orderStatus, 
            payment: { ...order?.payment, status: response.data?.payment?.status }, 
        } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
    }
  };

  const renderActionButtons = (order) => {
    console.log('order được chọn', order);
    if (order?.payment?.status === 'Chưa thanh toán'){
      if (order?.orderStatus === 'Đang xử lý' || (order?.orderStatus === 'Đã xác nhận' && !order?.errorTime)){
        return (
          <button
            onClick={() => handleCancelOrder(order?._id)}
            className="bg-red-500 text-white px-3 py-1 rounded ml-2 mt-2"
          >
            Hủy đơn
          </button>
        );
      }
    }
  };

  // Tách đơn hàng theo trạng thái
  const pendingOrders = orders.filter(order => order?.orderStatus === 'Đang xử lý');

  // Tính toán trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = pendingOrders.slice(indexOfFirstOrder, indexOfLastOrder); // Lấy danh sách đơn hàng hiện tại
  const totalPages = Math.ceil(pendingOrders.length / ordersPerPage); // Tổng số trang

  return (
    <div> 
      <h3 className="text-lg font-bold">Đơn hàng chờ xử lý</h3>
      {currentOrders.length > 0 ? currentOrders.map(order => (
        <div key={order?._id} className="border p-4 my-2">
          <p>Mã đơn hàng: {order?._id}</p>
          <div className="ml-4">
            {order?.items.map((item) => (
              <div key={item?.product?._id} className="flex items-center justify-between border gap-6 p-4 border-gray-200 rounded">
                <Link to={item?.product ? `/products/details/${item?.product?._id}` : '#'} className="w-28">
                  <img src={item?.product ? item?.product?.image : ''} alt={item?.product ? item?.product?.name : "Sản phẩm không khả dụng"} className="w-full" />
                </Link>
                <p>{item?.product?.name}</p> {/* Giả sử bạn có tên sản phẩm ở đây */}
                <p>{item?.quantity}</p>
                <p>{item?.price.toLocaleString()} VND</p>
                <p>{item?.color}</p>
                <p>{item?.size}</p>
              </div>
            ))}
          </div>
          <p>Ngày đặt: {new Date(order?.createdAt).toLocaleDateString()}</p>
          <p>Tổng giá trị: {order?.totalAmount.toLocaleString()} VND</p> 
          <p>Trạng thái thanh toán: {order?.payment?.status}</p>  
          {renderActionButtons(order)}
        </div>
      )) : (<p>Hiện đang trống</p>)
      }
      {totalPages > 1 &&
        <Pagination 
          totalPages={totalPages}
          currentPage={currentPage}
          paginate={(pageNumber) => setCurrentPage(pageNumber)} // Cập nhật trang hiện tại
        />
      }
      <ToastContainer limit={3}/>
    </div>
  );
};

export default OrderPending;
