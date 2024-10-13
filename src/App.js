import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Footer from './layout/Footer/Footer';
import Header from './layout/Header/Header';
import Navbar from './layout/Navbar/Navbar';
import './main.css';
import { UserProvider } from './components/context/UserContext';
import { ProductProvider } from './components/context/ProductContext';
import Home from './layout/Home/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/users/Profile';
import ProductList from './components/products/ProductList';
// import ProtectedRoute from './route/ProtectedRoute';
// import ProtectedComponent from './components/security/ProtectedComponent';
import PublicRoute from './route/PublicRoute';
import FavoritePage from './components/favorite/FavoritePage';
import { CartProvider } from './components/context/CartContext';
import CartList from './components/carts/CartList';
import ProductDetails from './components/products/ProductDetails';
import Checkout from './components/orders/Checkout';
import PaymentSuccess from './components/payments/PaymentSuccess';
import PaymentCancel from './components/payments/PaymentCancel';
// import AddressSelector from './components/users/AddressAll';

const App = () => {
  const [isNotification, setIsNotification] = useState(true);

  return (
    <UserProvider>
      <CartProvider>
      <ProductProvider>
      <Router>
      <div className="App">
        {isNotification && <Header/>}
        {isNotification && <Navbar/>}
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path="/login" element={<PublicRoute component={Login} />} />
            {/* <Route path="/protected" element={<ProtectedRoute component={ProtectedComponent} />} /> */}
            <Route path='/register' element={<Register/>}/>
            <Route path='/profile' element={<Profile/>}/>
            {/* <Route path='/address' element={<AddressSelector/>}/> */}
            <Route path='/products' element={<ProductList/>}/>
            <Route path='/products/details/:productId' element={<ProductDetails/>}/>
            <Route path='/favorites' element={<FavoritePage/>}/>
            <Route path='/cart' element={<CartList/>}/>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<PaymentSuccess setIsNotification={setIsNotification}/>} />
            <Route path="/checkout/cancel" element={<PaymentCancel setIsNotification={setIsNotification}/>} />
          </Routes>
        {isNotification &&<Footer />}
      </div>
      </Router>
      </ProductProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
