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
