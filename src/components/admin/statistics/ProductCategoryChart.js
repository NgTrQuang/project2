import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductCategoryChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/statistics/products/category-count');
        const data = response.data;

        // Format dữ liệu cho biểu đồ
        const categories = [];
        const productCounts = [];

        data.forEach(stat => {
          categories.push(stat._id); // category id (hoặc có thể load tên category dựa vào id)
          productCounts.push(stat.count);
        });

        setChartData({
          labels: categories,
          datasets: [
            {
              label: 'Số lượng của sản phẩm',
              data: productCounts,
              backgroundColor: 'rgb(233, 95, 115, 0.6)',
              borderColor: 'rgb(233, 95, 115, 1)',
              borderWidth: 1,
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải thống kê sản phẩm:', error);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* <h2>Product Count by Category</h2> */}
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
              text: 'Số lượng sản phẩm theo từng thể loại',
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

export default ProductCategoryChart;
