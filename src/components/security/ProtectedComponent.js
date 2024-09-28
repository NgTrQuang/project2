// ProtectedComponent.js
import React from 'react';

const ProtectedComponent = () => {
  return (
    <div>
      <h1>Trang này dành cho người dùng đã đăng nhập!</h1>
      <p>Trang này chỉ có thể truy cập được bởi người dùng đã đăng nhập.</p>
    </div>
  );
};

export default ProtectedComponent;
