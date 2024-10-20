import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserActivions = () => {
  // State để lưu dữ liệu thống kê người dùng
  const [usersData, setUsersData] = useState({ total: 0, active: 0, inactive: 0 });

  // Gọi API lấy dữ liệu thống kê người dùng
  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/statistics/users/active');
        setUsersData({
          total: response.data.totalUsers,
          active: response.data.activeUsers,
          inactive: response.data.inactiveUsers,
        });
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
      }
    };
    fetchUserStatistics();
  }, []);

  // Dữ liệu biểu đồ
  const data = {
    labels: ['Tổng người dùng', 'Đang hoạt động', 'Vô hiệu hóa'],
    datasets: [
      {
        label: 'Số lượng tài khoản',
        data: [usersData.total, usersData.active, usersData.inactive],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê trạng thái tài khoản người dùng',
      },
    },
  };

  return (
    <div style={{ width: '100%', margin: '10px auto' }}>
      {/* <h2>Thống kê trạng thái tài khoản người dùng</h2> */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default UserActivions;
