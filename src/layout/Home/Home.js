import React from 'react';
import Banner from '../Banner/Banner';
import Feature from '../Feature/Feature';
import Categories from '../Categories/Categories';
import RecommentProduct from '../../components/products/RecommentProduct';
// import ProductReview from '../ProductReview/ProductReview';

const Home = () => {
  return (
    <div>
      <Banner />
      <Feature />
      <Categories />
      {/* <ProductReview /> */}
      <div className="container pb-16">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
          Sản phẩm gợi ý
        </h2>
        <RecommentProduct/>
      </div>
    </div>
  );
}

export default Home;
