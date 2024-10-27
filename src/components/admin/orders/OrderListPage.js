import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../../../common/Pagination';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [ordersPerPage] = useState(3); // Số đơn hàng trên mỗi trang

  // Lấy danh sách đơn hàng từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/orders/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải danh sách đơn hàng');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // Hàm để cập nhật trạng thái đơn hàng
  const handleStatusChange = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/orders/update-status/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      // Cập nhật trạng thái đơn hàng sau khi API trả về thành công
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { 
            ...order, 
            orderStatus: response.data.orderStatus, 
            payment: { ...order.payment, status: response.data.payment.status }, 
        } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    }
  };

  // Hàm để hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/orders/cancel-error/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  // Hiển thị nút hành động tùy theo trạng thái đơn hàng
  const renderActionButtons = (order) => {
    switch (order?.orderStatus) {
      case 'Đang xử lý':
        return (
            <>
            <button
              onClick={() => handleStatusChange(order?._id)}
              className="bg-green-500 text-white px-3 py-1 rounded ml-2"
            >
              Xác nhận
            </button>
            {/* {order?.payment.status === 'Chưa thanh toán' ?
            <button
              onClick={() => handleCancelOrder(order._id)}
              className="bg-red-500 text-white px-3 py-1 rounded ml-2"
            >
              Hủy đơn
            </button>
            : <></>
            } */}
            </>
        );
      case 'Đã xác nhận':
        return (
            <>
            <button
                onClick={() => handleStatusChange(order?._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded ml-2"
            >
                Giao hàng
            </button>
            {/* {order.payment.status === 'Chưa thanh toán' && !order.errorTime ?
            <button
              onClick={() => handleCancelOrder(order._id)}
              className="bg-red-500 text-white px-3 py-1 rounded ml-2"
            >
              Hủy đơn
            </button>
            : <></>} */}
            </>
        );
      case 'Đang giao hàng':
        return (
          <button
            onClick={() => handleStatusChange(order?._id)}
            className="bg-yellow-500 text-white px-3 py-1 rounded ml-2"
          >
            Đã giao hàng
          </button>
        );
      case 'Đã nhận hàng':
        const isErrorExpired = order?.errorTime && new Date() - new Date(order?.errorTime) > 24 * 60 * 60 * 1000;
        console.log(isErrorExpired);
        return (
            <>   
            { !isErrorExpired ?
            <button
                onClick={() => handleCancelOrder(order?._id)}
                className="bg-purple-500 text-white px-3 py-1 rounded ml-2"
            >
                Lỗi sản phẩm
            </button> : <></>}
            </>
        );
      case 'Lỗi sản phẩm':
        return (
            <>   
            <button
                onClick={() => handleCancelOrder(order?._id)}
                className="bg-purple-500 text-white px-3 py-1 rounded ml-2"
            >
                Xác nhận
            </button>
            </>
        );
      default:
        return null;
    }
  };

  // Tính toán trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder); // Lấy danh sách đơn hàng hiện tại
  const totalPages = Math.ceil(orders.length / ordersPerPage); // Tổng số trang

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-semibold mb-6">Danh sách đơn hàng</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Mã đơn hàng</th>
              <th className="py-2 px-4 border">Tổng tiền</th>
              <th className="py-2 px-4 border">Trạng thái đơn hàng</th>
              <th className="py-2 px-4 border">Trạng thái thanh toán</th>
              <th className="py-2 px-4 border">Địa chỉ giao hàng</th>
              <th className="py-2 px-4 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order?._id} className="text-center">
                <td className="py-2 px-4 border">{order?._id}</td>
                <td className="py-2 px-4 border">{order?.totalAmount.toLocaleString()} đ</td>
                <td className="py-2 px-4 border">{order?.orderStatus}</td>
                <td className="py-2 px-4 border">{order?.payment?.status || 'Chưa thanh toán'}</td>
                <td className="py-2 px-4 border">{order?.shippingAddress}</td>
                <td className="py-2 px-4 border">
                  {renderActionButtons(order)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {totalPages && 
        <Pagination 
          totalPages={totalPages}
          currentPage={currentPage}
          paginate={(pageNumber) => setCurrentPage(pageNumber)} // Cập nhật trang hiện tại
        />
      }
    </div>
  );
};

export default OrderListPage;
