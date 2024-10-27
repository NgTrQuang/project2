import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill'; // Để sử dụng rich text editor cho mô tả
import 'react-quill/dist/quill.snow.css'; // Import CSS của Quill
import { storage } from '../../../common/firebaseConfig'; // Import storage từ Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { useParams } from 'react-router-dom'; // Dùng useParams để lấy ID sản phẩm

const ProductEditForm = ({ selectedProduct, setSelectedProduct }) => {
    console.log('selectedProduct: ', selectedProduct)
//   const { productId } = useParams(); // Lấy ID sản phẩm từ URL
//   const history = useHistory(); // Dùng useHistory để điều hướng sau khi lưu sản phẩm
  const [name, setName] = useState(selectedProduct?.name);
  const [description, setDescription] = useState(selectedProduct?.description);
  const [price, setPrice] = useState(selectedProduct?.price);
  const [category, setCategory] = useState(selectedProduct?.category?._id);
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState(selectedProduct?.variants);

  const [oldImages, setOldImages] = useState(selectedProduct?.image);
  const [newImages, setNewImages] = useState([]);

  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

  // Lấy danh sách các danh mục từ server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Lấy thông tin sản phẩm từ API
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
//         const product = response.data;
//         setName(product.name);
//         setDescription(product.description);
//         setPrice(product.price);
//         setCategory(product.category);
//         setVariants(product.variants);
//         setSelectedImages(product.image); // Chỉ cần đặt lại selectedImages với URL đã tải lên
//       } catch (err) {
//         console.error('Error fetching product:', err);
//         setError('Product not found!');
//       }
//     };

//     fetchProduct();
//   }, [productId]);

  // Hàm xử lý thay đổi hình ảnh
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files) {
      setNewImages((prevImages) => [...prevImages, ...files]);
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setSelectedImages((prevSelectedImages) => [...prevSelectedImages, ...imageUrls]);
    }
  };

  // Hàm xóa hình ảnh khỏi danh sách đã chọn
  const removeImage = (indexToRemove) => {
    setNewImages(newImages.filter((_, index) => index !== indexToRemove));
    setSelectedImages(selectedImages.filter((_, index) => index !== indexToRemove));
  };

  const removeOldImage = (indexToRemove) => {
    setOldImages(oldImages.filter((_, index) => index !== indexToRemove));
  }
  // Hàm tải lên hình ảnh lên Firebase Storage
  const uploadImages = async () => {
    const uploadedImageUrls = [];

    for (let i = 0; i < newImages.length; i++) {
      try {
        const storageRef = ref(storage, `images/products/${newImages[i].name}`);
        const snapshot = await uploadBytes(storageRef, newImages[i]);
        const imageUrl = await getDownloadURL(snapshot.ref);
        uploadedImageUrls.push(imageUrl);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }
    return uploadedImageUrls;
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { color: '', size: '', stock: '' }]);
  };

  const removeVariant = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsProcessing(true);
    // Tải lên hình ảnh và lấy URL
    const imageUrls = await uploadImages();
    const combinedImages = [...oldImages, ...imageUrls];

    const updatedProduct = {
      name,
      description,
      price,
      category,
      variants,
      image: combinedImages,
    };

    try {
      const response = await axios.put(`http://localhost:3000/api/products/${selectedProduct?._id}`, updatedProduct);
      setSuccess('Sản phẩm cập nhật thành công!');
      setSelectedImages([]);
      setOldImages(combinedImages);
      console.log(response.data);
    //   setSelectedProduct(response.data);
    } catch (err) {
      setError('Failed to update product. Please try again.');
    }
    finally {
      setIsProcessing(false); // Kết thúc xử lý và ẩn lớp overlay
    }
  };

  const colorMapping = {
    'Đỏ': '#FF0000',
    'Xanh': '#00FF00',
    'Xanh dương': '#0000FF',
    'Xanh biển': '#008B8B',
    'Xanh nhạt': '#00CED1',
    'Vàng': '#FFFF00',
    'Vàng nhạt': '#FFFACD',
    'Xám': '#808080',
    'Đen': '#000000',
    'Trắng': '#FFFFFF',
    'Nâu': '#A52A2A',
    'Hồng': '#FFC0CB',
    'Tím': '#800080',
    'Cam': '#FFA500',           
    'Xanh lá cây': '#228B22',   
    'Xanh quân đội': '#556B2F', 
    'Be': '#F5F5DC',            
    'Vàng chanh': '#FFD700',    
    'Xanh ngọc': '#40E0D0',     
    'Bạc': '#C0C0C0',          
    'Xanh rêu': '#6B8E23',      
    'Xanh navy': '#000080',     
    'Đỏ rượu': '#8B0000',       
    'Vàng cam': '#FFCC00',      
    'Xanh olive': '#808000',   
    'Xanh mint': '#98FF98',     
    'Tím nhạt': '#D8BFD8',      
    'Xanh lục nhạt': '#98FB98', 
    'Hồng phấn': '#FF69B4',    
    'Xanh pastel': '#B0E0E6',   
    'Đỏ tươi': '#FF4500',      
    'Xám tro': '#BEBEBE',
    'Tím than': '#4B0082',       
};

  const sizeMapping = [
    'XS',  
    'S',   
    'M',   
    'L',   
    'XL',  
    'XXL', 
    'XXXL', 
    '4XL', 
    '5XL', 
    '6XL', 
    '28',  
    '29',  
    '30',  
    '31',  
    '32',  
    '33',  
    '34',  
    '36',  
    '38',  
    '40',  
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto border border-gray rounded-lg shadow-md">
      <h2 className="text-2xl text-center mb-6">Chỉnh sửa sản phẩm</h2>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {success && <p className="text-green-600 text-center mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        {/* Hình ảnh */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Hình ảnh sản phẩm:</label>
          {oldImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-4">
              {oldImages.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`product_${index}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeOldImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                    style={{ transform: 'translate(50%, -50%)' }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          {selectedImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-4">
              {selectedImages.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`product_${index}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                    style={{ transform: 'translate(50%, -50%)' }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tên sản phẩm */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Tên sản phẩm:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Mô tả chi tiết */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Mô tả chi tiết:</label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            theme="snow"
            placeholder="Nhập mô tả sản phẩm"
            className="border border-gray-300 rounded-md"
          />
        </div>

        {/* Giá */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Giá:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={1}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Danh mục */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Danh mục:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="">Danh mục (Thể loại)</option>
            {categories.map((category) => (
              <option key={category?._id} value={category?._id}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>

        {/* Biến thể */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Biến thể:</label>
          {/* {variants.map((variant, index) => (
            <div key={index} className="mb-4 flex items-center space-x-4">
              <input
                type="text"
                placeholder="Màu sắc"
                value={variant.color}
                onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
                style={{ backgroundColor: colorMapping[variant.color] || '#ffffff' }}
              />
              <input
                type="text"
                placeholder="Kích thước"
                value={variant.size}
                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Số lượng"
                value={variant.stock}
                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="bg-red-500 text-white px-2 py-1 rounded-md"
              >
                Xóa
              </button>
            </div>
          ))} */}
          {variants.map((variant, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-md mb-4 flex flex-col lg:flex-row gap-4">
              <div className="mb-4 flex-1">
                <label className="block font-medium mb-2">Màu sắc:</label>
                <select
                  value={variant?.color}
                  onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="">Chọn màu</option>
                  {Object.keys(colorMapping).map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <span
                  className="inline-block mt-3 border border-gray-200 rounded-sm cursor-pointer shadow-sm"
                  style={{
                    width: variant?.color ? '24px' : '0', 
                    height: variant?.color ? '24px' : '0',
                    backgroundColor: variant?.color ? colorMapping[variant?.color] : 'transparent',
                  }}
                ></span>
              </div>

              <div className="mb-4 flex-1">
                <label className="block font-medium mb-2">Size:</label>
                <select
                  value={variant?.size}
                  onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="">Chọn size</option>
                  {sizeMapping.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 flex-1">
                <label className="block font-medium mb-2">Số lượng:</label>
                <input
                  type="number"
                  value={variant?.stock}
                  onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                  min={1}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>

              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="mt-9 bg-red-600 text-white px-4 h-10 rounded-md hover:bg-red-700"
              >
                <i class="fa-solid fa-xmark"></i>{/* Xóa biến thể */}
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Thêm biến thể
          </button>
        </div>

        {/* Nút lưu */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            {isProcessing ? "Đang xử lý..." : "Lưu sản phẩm"}
          </button>
        </div>
      </form>

      {isProcessing && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            cursor: "not-allowed", 
          }}
        />
      )}
    </div>
  );
};

export default ProductEditForm;
