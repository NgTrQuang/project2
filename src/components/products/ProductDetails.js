import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QuantitySelector from '../products/QuantitySelector';
import AddToCartButton from '../carts/AddToCartButton';
import { useUserContext } from '../context/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  
  const [selectedImage, setSelectedImage] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
      setProduct(response.data);
      setLoading(false);
      setSelectedImage(response.data?.image[0]);
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

  // Hàm để chuyển ảnh khi click mũi tên trái
  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + product?.image.length) % product?.image.length;
    setCurrentIndex(newIndex);
    setSelectedImage(product?.image[newIndex]);
  };

  // Hàm để chuyển ảnh khi click mũi tên phải
  const handleNext = () => {
    const newIndex = (currentIndex + 1) % product?.image.length;
    setCurrentIndex(newIndex);
    setSelectedImage(product?.image[newIndex]);
  };

  // Hàm để lấy 5 ảnh liên tiếp với kiểu vòng tròn
  const getVisibleImages = (currentIndex, totalImages) => {
    const images = [];
    for (let i = 0; i < 5; i++) {
      const index = (currentIndex + i) % totalImages;
      images.push(product?.image[index]);
    }
    return images;
  };

  return (
    <div className="container mx-auto py-8">
      {/* <h1>Chi tiết sản phẩm</h1> */}
      {product ? (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="product-image">
            <img 
            src={selectedImage} 
            alt={product?.name} 
            className="w-full h-auto rounded-md object-cover" />
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrev}
                className="text-dark bg-white-800 p-2 rounded-full"
              >
                &#8592; 
              </button>
              <div className="grid grid-cols-5 gap-4 mt-4"> 
              {getVisibleImages(currentIndex, product?.image.length).map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`product-${index}`} 
                  className="w-full h-20 object-cover cursor-pointer border border-gray-200 rounded-md" 
                  onClick={() => setSelectedImage(image)}        
                />    
              ))}  
              </div>
              <button
                onClick={handleNext}
                className="text-dark bg-white-800 p-2 rounded-full"
              >
                &#8594;
              </button>
            </div>   
          </div>
          <div className="">
            <h3 className="text-xl font-medium mb-4 mt-4">Mô tả sản phẩm</h3>
            <div
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: product?.description }}
            />
          </div>         
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="product-info">
            <h2 className="text-3xl font-medium mb-4 mt-8">{product?.name}</h2>
            <div className="flex items-center mb-4">
              <div className="flex gap-1 text-sm text-yellow-400">
                {Array(5).fill().map((_, index) => (
                  <i key={index} className={`fa-solid fa-star ${index > product.rating ? 'text-gray-300' : 'text-yellow-400'}`}></i>
                ))}
              </div>
              <div className="text-xs text-gray-500 ml-3">(Đánh giá)</div>               {/* {product.reviews?.length} */}
            </div>
            
            <div className="space-y-2">
              <p className="space-x-2">
                <span className="text-gray-800 font-semibold">Thể loại</span>
                <span className="text-gray-600">{product?.category?.name}</span>
              </p>
            </div>
            <div className="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
              <span className="text-gray-800 font-semibold">Giá: </span>
              <p className="text-xl text-primary font-semibold">{product?.price} VND</p>
            </div>
            <ColorList 
              colors={product ? [...new Set(product?.variants?.map(variant => variant?.color))] : []} 
              selectedColor={selectedColor}
              handleColorChange={handleColorChange}
            />
            <SizeList 
              sizes={product ? [...new Set(product?.variants?.map(variant => variant?.size))] : []} 
              selectedSize={selectedSize}
              handleSizeChange={handleSizeChange}
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
          <div className="flex justify-center">
          <div className="md:w-2/3 w-full items-center text-center">
            <h3 className="text-xl font-medium mb-4 ">Sản phẩm gợi ý</h3>
            <RecommentProduct/>
          </div>
          </div>
        </div>
        </>
      ) : (
        <div>Không tìm thấy sản phẩm</div>
      )}
      {/* <h3 className="text-2xl font-medium mb-4 mt-40">Sản phẩm gợi ý</h3>
      <RecommentProduct/> */}
        {/* <div className="md:w-1/3">
          <h3 className="text-2xl font-medium mb-4">Sản phẩm gợi ý</h3>
          <RecommentProduct/>
        </div> */}
      <ToastContainer limit={3}/>
    </div>
  );
};

export default ProductDetails;
