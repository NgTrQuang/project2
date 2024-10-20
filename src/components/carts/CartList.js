import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './CartList.module.css';
import { useUserContext } from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import QuantitySelector from '../products/QuantitySelector';
// import AddToCartButton from '../carts/AddToCartButton'; // Có thể sử dụng để cập nhật số lượng và thêm vào giỏ hàng
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CartList = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]); // State để lưu trữ các sản phẩm đã chọn
    // const [quantities, setQuantities] = useState({});
    const [totalPrice, setTotalPrice] = useState(0); // Tổng giá trị các sản phẩm được chọn
    const { userId } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            fetchCartItems();
        }
    }, [userId]);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/cart/${userId}`);
            setCartItems(response.data.products);
            console.log(response.data.products);
            // const initialQuantities = response.data.products.reduce((acc, item) => {
            //     acc[item.product._id] = item.quantity;
            //     return acc;
            // }, {});
            // setQuantities(initialQuantities);
            setLoading(false);
        } catch (error) {
            // setError('Không thể lấy giỏ hàng');
            setLoading(false);
        }
    };

    const removeFromCart = async (cartId) => {
        try {
            await axios.delete(`http://localhost:3000/api/cart/${userId}/product/${cartId}`);
            setCartItems((prevItems) => {
                const updatedItems = prevItems.filter(item => item._id !== cartId);
                // Kiểm tra xem sản phẩm bị xóa có nằm trong selectedItems không
                if (selectedItems.includes(cartId)) {
                    setSelectedItems(prevSelected => prevSelected.filter(id => id !== cartId)); // Bỏ chọn sản phẩm đã xóa
                    calculateTotalPrice(updatedItems); // Cập nhật tổng giá trị sau khi xóa
                }
                return updatedItems;
            });
            toast.success("Sản phẩm đã được xóa khỏi giỏ hàng", {
                position: "top-right",
                autoClose: 3000, // tự đóng sau 3 giây
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng', error);
        }
    };

    const handleUpdateCartItem = async (userId, cartId, color, size, quantity) => {
        if (quantity === 0) {
            await removeFromCart(cartId);
        } else {
            try {
                const response = await axios.put('http://localhost:3000/api/cart/update', {
                    userId: userId,
                    cartItemId: cartId,
                    color,
                    size,
                    quantity,
                });

                const updatedCartItem = response.data.cartItems.products;

                console.log(response.data.cartItems.products);

                // setCartItems(prevItems => prevItems.map(item => 
                //     item._id === updatedCartItem._id ? updatedCartItem : item
                // ));
                setCartItems(updatedCartItem);
                // toast.success("Giỏ hàng đã được cập nhật", {
                //     position: "top-right",
                //     autoClose: 3000,
                // });
                if (selectedItems.includes(cartId)) {
                    calculateTotalPrice(updatedCartItem); // Cập nhật lại tổng khi sản phẩm đã chọn
                }
            } catch (error) {
                toast.error(error.response?.data.message || "Có lỗi xảy ra khi cập nhật giỏ hàng", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        }
    };

    const handleQuantityChange = (cartId, newQuantity) => {
        // Tìm item trong cartItems và cập nhật số lượng
        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === cartId ? { ...item, quantity: newQuantity } : item
            )
        );
        const updatedItem = cartItems.find(item => item._id === cartId);
        if (updatedItem) {
            handleUpdateCartItem(userId, updatedItem._id, updatedItem.color, updatedItem.size, newQuantity);
        }
        calculateTotalPrice();
    };    

    //Màu
    const handleColorChange = (cartId, newColor) => {
        setCartItems(prevItems => 
            prevItems.map(item => 
              item._id === cartId ? { ...item, color: newColor } : item
            )
        );
        const updatedItem = cartItems.find(item => item._id === cartId);
        if (updatedItem) {
            handleUpdateCartItem(userId, updatedItem._id, newColor, updatedItem.size, updatedItem.quantity);
        }
    };
    //Size
    const handleSizeChange = (cartId, newSize) => {
        setCartItems(prevItems => 
            prevItems.map(item => 
              item._id === cartId ? { ...item, size: newSize } : item
            )
        );
        const updatedItem = cartItems.find(item => item._id === cartId);
        if (updatedItem) {
            handleUpdateCartItem(userId, updatedItem._id, updatedItem.color, newSize, updatedItem.quantity);
        }
    };

    // Hàm tính tổng giá trị của các sản phẩm đã chọn
    const calculateTotalPrice = () => {
        const validSelectedItems = selectedItems.filter(cartId => {
            return cartItems.some(item => item._id === cartId); // Kiểm tra xem sản phẩm còn tồn tại trong cartItems không
        });
    
        const total = validSelectedItems.reduce((sum, cartId) => {
            const selectedItem = cartItems.find(item => item._id === cartId);
            if (selectedItem) {
                // Lấy số lượng từ state quantities, nếu không có thì mặc định là số lượng ban đầu
                const itemQuantity = selectedItem.quantity || 0; //quantities[selectedItem.product._id]
                // Tính tổng giá cho từng sản phẩm đã chọn
                return sum + (selectedItem.product.price * itemQuantity);
            }
        }, 0);
        setTotalPrice(total);
    };

    // Hàm xử lý việc chọn sản phẩm
    const handleSelectItem = (cartId) => {
        setSelectedItems(prevSelected => {
            const updatedSelected = prevSelected.includes(cartId)
                ? prevSelected.filter(id => id !== cartId) // Bỏ chọn nếu đã được chọn
                : [...prevSelected, cartId]; // Thêm vào danh sách chọn
            calculateTotalPrice();
            // console.log(updatedSelected);
            // console.log(selectedItems);
            return updatedSelected;
        });
    };

    // Tính lại tổng khi selectedItems thay đổi
    useEffect(() => {
        calculateTotalPrice();
    }, [cartItems, selectedItems]);


    if (loading) return <div>Đang tải giỏ hàng...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="space-y-4">
            {cartItems && cartItems.length > 0 ? (
                cartItems.map((item) => (
                    <div key={item._id} className="flex items-center justify-between border gap-6 p-4 border-gray-200 rounded">
                        {/* Checkbox */}
                        <input
                            type="checkbox"
                            checked={selectedItems.includes(item._id)} // Kiểm tra sản phẩm có được chọn không
                            onChange={() => handleSelectItem(item._id)} // Xử lý khi thay đổi trạng thái checkbox
                        />
                        
                        {/* Product Image */}
                        <Link to={item?.product?._id ? `/products/details/${item.product._id}` : '#'} className="w-28">
                            <img src={item.product ? item.product.image : ''} alt={item.product ? item.product.name : "Sản phẩm không khả dụng"} className="w-full" />
                        </Link>

                        {/* Product Details */}
                        <div className={styles.itemOptions}>
                            <h2 className="text-gray-800 text-xl font-medium uppercase">{item.product ? item.product.name : "Sản phẩm không khả dụng"}</h2>
                            {/* <p className="text-gray-500 text-sm">Số lượng: {item.quantity}</p> */}
                            {/* Dropdown chọn màu sắc */}
                            <select 
                                value={item.color} 
                                onChange={(e) => handleColorChange(item._id, e.target.value)}
                                className={styles.dropdownSelect}
                            >
                                {[...new Set(item?.product?.variants.map(variant => variant.color))].map((color, index) => (
                                <option key={index} value={color}>{color}</option>
                                ))}
                            </select>

                            {/* Dropdown chọn size */}
                            <select 
                                value={item.size} 
                                onChange={(e) => handleSizeChange(item._id, e.target.value)}
                                className={styles.dropdownSelect}
                            >
                                {[...new Set(item?.product?.variants.map(variant => variant.size))].map((size, index) => (
                                <option key={index} value={size}>{size}</option>
                                ))}
                            </select>

                            <QuantitySelector
                                quantity={item.quantity}
                                onQuantityChange={(newQuantity) => handleQuantityChange(item._id, newQuantity)}
                                onRemove={() => removeFromCart(item._id)}
                                selectedColor={item.color}
                                selectedSize={item.size}
                                selectedProduct={item.product} // Dùng item thay vì cartItem
                            />
                        </div>

                        {/* Product Price */}
                        <div className="text-primary text-lg font-semibold">{item?.product ? item.product.price : 'N/A'} VND</div>

                        {/* Xóa sản phẩm khỏi giỏ hàng */}
                        <div className="text-gray-600 cursor-pointer hover:text-primary" onClick={() => removeFromCart(item._id)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </div>
                    </div>
                ))
            ) : (
                <p>Giỏ hàng trống</p>
            )}
            {/* Hiển thị tổng giá trị thanh toán */}
            <div className="text-right font-semibold text-lg">
                Tổng giá trị: {totalPrice} VND
            </div>
            <button 
                className="bg-primary text-white px-4 py-2 mt-4 rounded ml-auto block"
                onClick={() => {
                    navigate('/checkout', {
                        state: {
                            selectedItems,
                            cartItems,
                            totalPrice,
                        }
                    });
                }}
            >
                Đặt hàng
            </button>
            <ToastContainer/>
        </div>
    );
};

export default CartList;
