import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopSellingProductsChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/statistics/products/top-selling-products');
        const data = response.data;

        const productNames = data.map(product => product.productName);
        const quantitiesSold = data.map(product => product.quantitySold);
        const productPrices = data.map(product => product.price);

        setChartData({
          labels: productNames,
          datasets: [
            {
              label: 'Số lượng bán',
              data: quantitiesSold,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
          prices: productPrices,
        });
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải thống kê sản phẩm bán chạy:', error);
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* <h2>Top 5 Sản phẩm bán chạy nhất</h2> */}
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
              text: 'Top 5 Sản phẩm bán chạy nhất',
            },
            tooltip: {
              callbacks: {
                // Tùy chỉnh tooltip để hiển thị giá sản phẩm
                label: (tooltipItem) => {
                  const productIndex = tooltipItem.dataIndex;
                  const productName = chartData.labels[productIndex];
                  const quantitySold = tooltipItem.raw;
                  const price = chartData.prices[productIndex]; // Lấy giá sản phẩm từ dữ liệu
                  return `${productName}: ${quantitySold} sản phẩm đã bán, Giá: ${price.toLocaleString()} VND`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default TopSellingProductsChart;
