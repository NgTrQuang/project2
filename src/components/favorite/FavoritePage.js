import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import FavoriteList from './FavoriteList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FavoritePage = () => {
    const { userId } = useUserContext();
    const [favoriteProducts, setFavoriteProducts] = useState([]);

    useEffect(() => {
        if(userId){       
            fetchFavorites();
        }
    }, [userId]);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/favorites/${userId}`);
            setFavoriteProducts(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách yêu thích:', error);
        }
    };
    // Xoá sản phẩm khỏi yêu thích
    const handleRemoveFavorite = async (productId) => {
        try {
        await axios.delete('http://localhost:3000/api/favorites/remove', { data: { userId, productId } });
        setFavoriteProducts(favoriteProducts.filter(product => product._id !== productId));
        toast.success("Sản phẩm đã được xóa khỏi danh sách yêu thích", {
            position: "top-right",
            autoClose: 3000, // tự đóng sau 3 giây
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        } catch (error) {
        console.error('Lỗi khi xóa sản phẩm khỏi yêu thích:', error);
        }
    };

    // // Thêm sản phẩm vào giỏ hàng
    // const handleAddToCart = (productId) => {
    //     console.log(`Sản phẩm ${productId} đã được thêm vào giỏ hàng`);
    //     // Thêm vào giỏ hàng thông qua API hoặc state management
    // };

return (
    // <div>
    //   <h2>Sản phẩm yêu thích của bạn</h2>
    //   <ul>
    //     {favoriteProducts.length > 0 ? (
    //       favoriteProducts.map((product) => (
    //         <li key={product._id}>
    //           <img src={product.image} alt={product.name} width="50" />
    //           <span>{product.name}</span>
    //           <button onClick={() => handleRemoveFavorite(product._id)}>Xóa</button>
    //         </li>
    //       ))
    //     ) : (
    //       <p>Chưa có sản phẩm yêu thích nào</p>
    //     )}
    //   </ul>
    // </div>
    <div>
        {/* <h1>Danh sách yêu thích của bạn</h1> */}
        <FavoriteList
        favoriteItems={favoriteProducts}
        handleRemoveFavorite={handleRemoveFavorite}
        userId={userId}
        // handleAddToCart={handleAddToCart}
        />
        <ToastContainer/>
    </div>
  );
};

export default FavoritePage;
