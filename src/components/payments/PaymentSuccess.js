import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
import axios from 'axios';

const PaymentSuccess = ({setIsNotification}) => {

    useEffect(() => {
        setIsNotification(false);
        captureOrder();
    }, [setIsNotification]);

    const captureOrder = async () => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
    
        try {
            await axios.post(`http://localhost:3000/api/payment/paypal/capture/${token}`);
            // toast.success('Thanh toán PayPal thành công!');
    
            // Điều hướng về trang chủ sau một khoảng thời gian ngắn
            // setTimeout(() => {
            //     navigate('/');
            // }, 2000);
        } catch (error) {
            console.error('Lỗi khi xác nhận thanh toán:', error);
            // toast.error('Đã xảy ra lỗi trong quá trình thanh toán.');
        }
    }; 

    const handleChangeButton = () => {
        setIsNotification(true);
    }

    return (
        <div className="flex items-center p-4 bg-green-100 border border-green-400 rounded-lg">
            {/* <CheckCircleIcon className="w-16 h-16 text-green-500 mr-4" /> */}
            <div className="flex-1">
                <h5 className="text-lg font-bold text-green-700">Chúc mừng bạn đã đặt hàng thành công.</h5>
                <p className="text-gray-600">Vui lòng check email để biết thêm thông tin về đơn hàng của bạn!</p>
            </div>
            <Link to={'/'}>
                <button onClick={handleChangeButton} variant="contained" color="primary" className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Trang chủ
                </button>
            </Link>
        </div>
    );
};

export default PaymentSuccess;
