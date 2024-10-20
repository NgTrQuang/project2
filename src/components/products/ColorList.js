import React from 'react';

const ColorList = ({ colors, selectedColor, handleColorChange }) => {
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
    'Tím than': '#4B0082'     
};
  
  return (
    <div className="flex items-center gap-2 mb-2">
      {colors?.map((color, index) => (
        <div key={index} className="color-selector">
          <input
            type="radio"
            name="color"
            id={color}
            className="hidden"
            checked={selectedColor === color}
            onChange={() => handleColorChange(color)}
          />
          <label
            htmlFor={color}
            className="border border-gray-200 rounded-sm h-6 w-6 cursor-pointer shadow-sm block"
            style={{ backgroundColor: colorMapping[color] }}
          ></label>
        </div>
      ))}
    </div>
  );
};

export default ColorList;
