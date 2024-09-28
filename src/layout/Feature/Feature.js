import React from 'react';

const Feature = () => {
  return (
    <div className="container py-16">
      <div className="w-10/12 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto justify-center">
        <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
          <img
            src="assets/images/icons/delivery-van.svg"
            alt="Free Shipping"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h4 className="font-medium capitalize text-lg">Miễn phí vận chuyển</h4>
            <p className="text-gray-500 text-sm">Đơn hàng từ 200k</p>
          </div>
        </div>
        <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
          <img
            src="assets/images/icons/money-back.svg"
            alt="Money Returns"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h4 className="font-medium capitalize text-lg">Hoàn tiền</h4>
            <p className="text-gray-500 text-sm">30 ngày hoàn tiền</p>
          </div>
        </div>
        <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
          <img
            src="assets/images/icons/service-hours.svg"
            alt="24/7 Support"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h4 className="font-medium capitalize text-lg">Hỗ trợ 24/7</h4>
            <p className="text-gray-500 text-sm">Hỗ trợ khách hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;
