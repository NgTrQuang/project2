import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QuantitySelector from '../products/QuantitySelector';
import AddToCartButton from '../carts/AddToCartButton';
import { useUserContext } from '../context/UserContext';
import { ToastContainer } from 'react-toastify';
import RecommentProduct from './RecommentProduct';
import SizeList from './SizeList';
import ColorList from './ColorList';

const ProductDetails = () => {
  const { productId } = useParams(); // Lấy productId từ URL
  const { userId } = useUserContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // State để lưu số lượng sản phẩm
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      setError('Không thể lấy chi tiết sản phẩm');
      setLoading(false);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };
  
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };
  
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  if (loading) return <div>Đang tải chi tiết sản phẩm...</div>;
  if (error) return <div>{error}</div>;

  // const getAvailableStock = () => {
  //   // Tìm variant có cùng màu và size mà người dùng đã chọn
  //   const variant = product.variants.find(
  //     (variant) => variant.color === selectedColor && variant.size === selectedSize
  //   );
  //   return variant ? variant.stock : 0; // Trả về stock của variant hoặc 0 nếu không tìm thấy
  // };

  return (
    <div className="container mx-auto py-8">
      {/* <h1>Chi tiết sản phẩm</h1> */}
      {product ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hình ảnh sản phẩm */}
          {/* <div className="product-image w-1/3">
            <img src={product.image} alt={product.name} className="w-full" />
          </div> */}
          <div className="product-image">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto rounded-md object-cover" />
            <div className="grid grid-cols-5 gap-4 mt-4">
              {product.images?.map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`product-${index}`} 
                  className="w-full h-20 object-cover cursor-pointer border border-gray-200 rounded-md" /> //w-full cursor-pointer border border-primary
              ))}
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="product-info">
            {/* <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-xl text-primary font-semibold">{product.price} VND</p>
            <p className="text-gray-700 my-4">{product.description}</p> */}
            <h2 className="text-3xl font-medium uppercase mb-2">{product.name}</h2>
            <div className="flex items-center mb-4">
              <div className="flex gap-1 text-sm text-yellow-400">
                {Array(5).fill().map((_, index) => (
                  <i key={index} className={`fa-solid fa-star ${index > product.rating ? 'text-gray-300' : 'text-yellow-400'}`}></i>
                ))}
              </div>
              <div className="text-xs text-gray-500 ml-3">(Đánh giá)</div>               {/* {product.reviews?.length} */}
            </div>

            <div className="space-y-2">
              {/* <p className="text-gray-800 font-semibold space-x-2">
                <span>Tình trạng: </span>
                <span className="text-green-600">{product.stock > 0 ? product.stock : 'Hết hàng'}</span>
              </p> */}
              {/* <p className="space-x-2">
                <span className="text-gray-800 font-semibold">Brand: </span>
                <span className="text-gray-600">{product.brand}</span>
              </p> */}
              {/* <p className="space-x-2">
                <span className="text-gray-800 font-semibold">Thể loại </span>
                <span className="text-gray-600">{product.category}</span>
              </p> */}
              {/* <p className="space-x-2">
                <span className="text-gray-800 font-semibold">SKU: </span>
                <span className="text-gray-600">{product.sku}</span>
              </p> */}
            </div>
            <div className="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
              <p className="text-xl text-primary font-semibold">{product.price} VND</p>
              {/* {product.oldPrice && <p className="text-base text-gray-400 line-through">{product.oldPrice} VND</p>} */}
            </div>
            {/* Chọn kích thước */}
            {/* <div className="pt-4">
              <h3 className="text-sm text-gray-800 uppercase mb-1">Kích thước</h3>
              <div className="flex items-center gap-2">
                {product.size?.map((size) => (
                  <div key={size} className="size-selector">
                    <input 
                      type="radio" 
                      name="size" 
                      id={size} 
                      className="hidden" />
                    <label 
                      htmlFor={size} 
                      className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">
                        {size}
                    </label>
                  </div>
                ))}
              </div>
            </div> */}
            <SizeList 
              sizes={[...new Set(product.variants.map(variant => variant.size))]} 
              selectedSize={selectedSize}
              handleSizeChange={handleSizeChange}
            />
            {/* Chọn màu sắc */}
            {/* <div className="pt-4 mb-2">
              <h3 className="text-sm text-gray-800 uppercase mb-1">Màu sắc</h3>
              <div className="flex items-center gap-2">
                {product.color?.map((color, index) => (
                  <div key={index} className="color-selector">
                    <input 
                      type="radio" 
                      name="color" 
                      id={color} 
                      className="hidden"
                      // checked={selectedColor === color}
                      // onChange={handleColorChange}
                      />
                    <label 
                      htmlFor={color} 
                      className="border border-gray-200 rounded-sm h-6 w-6 cursor-pointer shadow-sm block" 
                      style={{ backgroundColor: colorMapping[color] }}
                    >
                    </label>
                  </div>
                ))}
              </div>
            </div> */}
            <ColorList 
              colors={[...new Set(product.variants.map(variant => variant.color))]} 
              selectedColor={selectedColor}
              handleColorChange={handleColorChange}
            />
            {/* Selector số lượng */}
            <QuantitySelector 
              quantity={quantity} 
              onQuantityChange={handleQuantityChange}
              selectedColor={selectedColor} 
              selectedSize={selectedSize}
              selectedProduct={product}
            />

            {/* Button thêm vào giỏ */}
            <AddToCartButton 
              productId={productId}
              quantity={quantity}
              userId={userId}
              size={selectedSize}
              color={selectedColor}
            />
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-medium mb-4">Mô tả sản phẩm</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>
      ) : (
        <div>Không tìm thấy sản phẩm</div>
      )}
      <h3 className="text-xl font-medium mb-4 mt-4">Sản phẩm gợi ý</h3>
      <RecommentProduct/>
      <ToastContainer/>
    </div>
  );
};

export default ProductDetails;
