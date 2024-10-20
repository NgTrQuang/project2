import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderStatusTable = () => {
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/statistics/orders/status');
        setOrderStatusData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải thống kê đơn hàng:', error);
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className='mt-4 mb-2'>Bảng mô tả</h2>
      <table className="table-auto w-full text-center border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Trạng thái</th>
            <th className="py-2 px-4 border">Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {orderStatusData.map((status, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border">{status._id}</td>
              <td className="py-2 px-4 border">{status.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderStatusTable;
