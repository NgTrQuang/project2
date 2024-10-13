import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PaymentCancel = ({ setIsNotification }) => {
    
    useEffect(() => {
        setIsNotification(false);
    }, [setIsNotification]); // Chạy effect này chỉ khi setIsNotification thay đổi

    const handleChangeButton = () => {
        setIsNotification(true);
    }

    return (
    <div className="flex items-center p-6 bg-red-50 border-l-4 border-red-400 text-red-700 space-x-4">
      {/* <ErrorIcon className="text-red-600" style={{ fontSize: 64 }} /> */}
      <div className="flex-1">
        <h5 className="text-2xl font-semibold">Đặt hàng thất bại.</h5>
        <p className="text-lg">Vui lòng kiểm tra lại các bước đặt hàng của bạn!</p>
      </div>
      <Link to={'/'}>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
          onClick={handleChangeButton}
        >
          Trang chủ
        </button>
      </Link>
    </div>
    );
};

export default PaymentCancel;
