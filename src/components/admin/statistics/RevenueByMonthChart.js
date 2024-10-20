import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const RevenueByMonthChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [allTotalRevenue, setAllTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenueByMonth = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/statistics/revenue-by-month');
        const data = response.data;

        const months = data.map(item => `${item._id.month}/${item._id.year}`); // Tháng/Năm
        const revenues = data.map(item => item.totalRevenue); // Tổng doanh thu của từng tháng
        const totalYearlyRevenue = data.reduce((acc, item) => {
            return acc + item.totalRevenue;
        }, 0);

        setAllTotalRevenue(totalYearlyRevenue);

        setChartData({
          labels: months,
          datasets: [
            {
              label: 'Tổng doanh thu (VND)',
              data: revenues,
              fill: false,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              tension: 0.2, // Độ cong của đường biểu đồ
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu doanh thu theo tháng:', error);
        setLoading(false);
      }
    };

    fetchRevenueByMonth();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="mt-6 text-2xl font-bold text-green-600">
        Tổng doanh thu (trong năm): {allTotalRevenue.toLocaleString()} VND
      </h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Tổng doanh thu theo tháng',
            },
          },
        }}
      />
    </div>
  );
};

export default RevenueByMonthChart;
