import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserRegistrationChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/statistics/users/registration-by-month');
        const data = response.data;

        // Format data for chart
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const registrations = new Array(12).fill(0); // Khởi tạo mảng với 12 giá trị bằng 0

        data.forEach(stat => {
          registrations[stat._id - 1] = stat.count; // stat._id là số tháng (1-12)
        });

        setChartData({
          labels: months,
          datasets: [
            {
              label: 'Số lượng người dùng đã đăng ký',
              data: registrations,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải thống kê người dùng:', error);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* <h2>Người dùng đăng ký trong tháng</h2> */}
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Người dùng đăng ký trong tháng (Năm hiện tại)',
            },
          },
          scales: {
            x: {
              grid: {
                display: false, 
              },
            },
          },
        }}
      />
    </div>
  );
};

export default UserRegistrationChart;
