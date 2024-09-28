import React from 'react';
import Banner from '../Banner/Banner';
import Feature from '../Feature/Feature';
import Categories from '../Categories/Categories';
import ProductReview from '../ProductReview/ProductReview';

const Home = () => {
  return (
    <div>
      <Banner />
      <Feature />
      <Categories />
      <ProductReview />
    </div>
  );
}

export default Home;
