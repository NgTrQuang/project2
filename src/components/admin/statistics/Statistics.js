import React, { useState } from 'react';
import UserActivions from './UserActivions';
import UserRegistrationChart from './UserRegistrationChart';
import ProductCategoryChart from './ProductCategoryChart';
import TopSellingProductsChart from './TopSellingProductsChart';
import LowStockProducts from './LowStockProducts';
import OrderStatusChart from './OrderStatusChart ';
import OrderStatusTable from './OrderStatusTable';
import RevenueByMonthChart from './RevenueByMonthChart';
import TopCustomers from './TopCustomers';

function Statistics() {
  const [activeTab, setActiveTab] = useState('statistics');

  const handleChangeTab = (info) => {
    setActiveTab(info);
  }
  return (
    <div> 
        <button className='ml-8' onClick={() => handleChangeTab('userStatistics')}>Người dùng</button>  
        <button className='ml-8' onClick={() => handleChangeTab('productStatistics')}>Sản phẩm</button>  
        <button className='ml-8' onClick={() => handleChangeTab('orderStatistics')}>Đơn hàng</button>  
        {activeTab === 'statistics' && 
        <>
          <RevenueByMonthChart/>
          <TopCustomers/>
        </>
        }
        {activeTab === 'userStatistics' && 
        <>
          <UserActivions/>
          <UserRegistrationChart/>
        </>
        }
        {activeTab === 'productStatistics' && 
        <>
            <ProductCategoryChart/>
            <TopSellingProductsChart/>
            <LowStockProducts/>
        </>
        }
        {activeTab === 'orderStatistics' && 
        <>
           <OrderStatusChart/> 
           <OrderStatusTable/>
        </>
        }
    </div>
  );
}

export default Statistics;
