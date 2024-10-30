import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopCustomers = () => {
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/statistics/users/top');
        setTopCustomers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khách hàng:', error);
        setLoading(false);
      }
    };

    fetchTopCustomers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-6 p-6 bg-white">
      <h2 className="text-2xl font-bold text-blue-600">Top Khách hàng mua nhiều nhất</h2>
      {topCustomers.length === 0 ? (
        <p>Không có khách hàng nào.</p>
      ) : (
        <table className="table-auto w-full mt-4 text-center">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Tên khách hàng</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Tổng tiền chi tiêu (VND)</th>
              <th className="px-4 py-2 border">Số lượng đơn hàng</th>
            </tr>
          </thead>
          <tbody>
            {topCustomers.map((customer, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{customer?.customerInfo?.fullName}</td>
                <td className="px-4 py-2 border">{customer?.customerInfo?.email}</td>
                <td className="px-4 py-2 border">{customer?.totalSpent.toLocaleString()}</td>
                <td className="px-4 py-2 border">{customer?.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TopCustomers;
