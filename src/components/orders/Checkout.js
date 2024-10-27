import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useUserContext } from '../context/UserContext';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedItems, cartItems, totalPrice } = location.state || {};
    console.log('Location state:', location.state); // Kiểm tra giá trị location.state
    console.log('Selected Items:', selectedItems); // Kiểm tra selectedItems
    console.log('Cart Items:', cartItems); // Kiểm tra cartItems
    console.log('Total Price:', totalPrice); // Kiểm tra totalPrice
    const { userId, user } = useUserContext(); // Lấy userId từ context
    // const shippingAddress = "Địa chỉ mẫu"; // Thay bằng địa chỉ người dùng nhập
    const [paymentMethod, setPaymentMethod] = useState("COD");

    const handleOrderConfirmation = async () => {
        // Gọi API để tạo đơn hàng
        // Cập nhật trạng thái đơn hàng, có thể thêm thông tin như userId, địa chỉ, v.v.
        try {
            const orderData = {
                user: userId, // Truyền userId vào API
                totalAmount: totalPrice,
                shippingAddress: user?.address, // Địa chỉ giao hàng
                paymentMethod: paymentMethod,     // Phương thức thanh toán
                items: selectedItems.map(id => ({
                    _id: id,
                    product: cartItems.find(item => item?._id === id)?.product?._id,
                    quantity: cartItems.find(item => item?._id === id)?.quantity,
                    price: cartItems.find(item => item?._id === id)?.product?.price,
                    size: cartItems.find(item => item?._id === id)?.size,
                    color: cartItems.find(item => item?._id === id)?.color, 
                })),
            };
            console.log('Truyền đi', orderData);
            if (paymentMethod === "PayPal") {
                const response = await axios.post('http://localhost:3000/api/orders', orderData);
                window.location.href = response.data.approvalUrl; // Chuyển hướng đến PayPal
                console.log('Tạo đơn hàng thành công', response.data);
            } else {
                // Xử lý phương thức thanh toán khác
                const response = await axios.post('http://localhost:3000/api/orders', orderData);
                // Điều hướng đến trang thành công hoặc trang khác
                navigate('/'); // Thay đổi đường dẫn thành công theo yêu cầu
                // toast.success("Bạn đã đặt hàng thành công, hãy xem lại đơn hàng của bạn ở danh sách đơn hàng!", {
                //     position: "top-right",
                //     autoClose: 5000, // tự đóng sau 5 giây
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                // });
                console.log('Tạo đơn hàng thành công', response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            // navigate('/'); // Điều hướng về trang chủ ngay cả khi có lỗi
            toast.error('Tạo đơn hàng không thành công, vui lòng tạo lại!');
            // Xử lý lỗi
        }
    };

    if (!selectedItems || selectedItems.length === 0) {
        return <div>Không có sản phẩm nào được chọn.</div>;
    }

    return (
        <div className="checkout-container p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Thanh toán</h1>
            {/* Thông tin người dùng */}
            <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">
                <i className="fa-solid fa-location-dot mr-2"></i>
                Địa chỉ nhận hàng
            </h3>
                <p className="p-1 w-full mb-2 ml-4">{user?.fullName}</p>
                <p className="p-1 w-full mb-2 ml-4">{user?.address}</p>
                <p className="p-1 w-full mb-2 ml-4">{user?.phoneNumber}</p>
            </div>
            <div className="space-y-4">
                {cartItems.map(item => (
                    selectedItems.includes(item?._id) && (
                        <div key={item?._id} className="flex justify-between border p-4 rounded">
                            <img src={item?.product?.image} alt={item?.product?.name} className="w-24" />
                            <div className="flex flex-col">
                                <h2 className="font-semibold">{item?.product?.name}</h2>
                                <p>Số lượng: {item?.quantity}</p>
                                <p>Giá: {item?.product?.price.toLocaleString()} VND</p>
                            </div>
                        </div>
                    )
                ))}
            </div>
            <div className="text-right font-semibold text-lg">
                Tổng giá trị: {totalPrice.toLocaleString()} VND
            </div>

            {/* Chọn phương thức thanh toán */}
            <div className="mt-4">
                <h3 className="font-semibold text-lg mb-2">Chọn phương thức thanh toán</h3>
                <div className="space-y-2">
                    <div>
                        <input
                            type="radio"
                            id="COD"
                            name="paymentMethod"
                            value="COD"
                            checked={paymentMethod === "COD"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor="COD" className="ml-2">Thanh toán khi nhận hàng (COD)</label>
                    </div>
                    {/* <div>
                        <input
                            type="radio"
                            id="CreditCard"
                            name="paymentMethod"
                            value="CreditCard"
                            checked={paymentMethod === "CreditCard"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor="CreditCard" className="ml-2">Thẻ tín dụng</label>
                    </div> */}
                    <div>
                        <input
                            type="radio"
                            id="PayPal"
                            name="paymentMethod"
                            value="PayPal"
                            checked={paymentMethod === "PayPal"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor="PayPal" className="ml-2">PayPal</label>
                    </div>
                </div>
            </div>

            <button 
                className="bg-primary text-white px-4 py-2 mt-4 rounded ml-auto block"
                onClick={handleOrderConfirmation}
            >
                Xác nhận đặt hàng
            </button>
            <ToastContainer/>
        </div>
    );
};

export default Checkout;
