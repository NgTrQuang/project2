import React from 'react';
import Banner from '../Banner/Banner';
import Feature from '../Feature/Feature';
import Categories from '../Categories/Categories';
import RecommentProduct from '../../components/products/RecommentProduct';
import AboutUs from '../AboutUs';
import Contact from '../Contact';
// import ProductReview from '../ProductReview/ProductReview';

const Home = () => {

  return (
    <div>
      <Banner />
      {/* <Feature /> */}
      <Categories />
      {/* <ProductReview /> */}
      <div className="container pb-16">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Sản phẩm gợi ý
        </h2>
        <RecommentProduct/>
      </div>
      <AboutUs/>
      <Contact/>
    </div>
  );
}

export default Home;
