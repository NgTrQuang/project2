import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrderStatusChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/statistics/orders/status');
        const data = response.data;

        const statuses = data.map(order => order._id); // Trạng thái đơn hàng (pending, shipped, etc.)
        const counts = data.map(order => order.count); // Số lượng đơn hàng trong từng trạng thái

        setChartData({
          labels: statuses,
          datasets: [
            {
              label: 'Số lượng đơn hàng',
              data: counts,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });
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
              text: 'Thống kê đơn hàng theo trạng thái',
            },
          },
        }}
      />
    </div>
  );
};

export default OrderStatusChart;
