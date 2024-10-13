import React from 'react';

const SizeList = ({ sizes, selectedSize, handleSizeChange }) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      {sizes?.map((size) => (
        <div key={size} className="size-selector">
          <input
            type="radio"
            name="size"
            id={size}
            className="hidden"
            checked={selectedSize === size}
            onChange={() => handleSizeChange(size)}
          />
          <label
            htmlFor={size}
            className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600"
          >
            {size}
          </label>
        </div>
      ))}
    </div>
  );
};

export default SizeList;
