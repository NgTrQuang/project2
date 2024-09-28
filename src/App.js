import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './layout/Footer/Footer';
import Header from './layout/Header/Header';
import Navbar from './layout/Navbar/Navbar';
import './main.css';
import { UserProvider } from './components/context/UserContext';
import Home from './layout/Home/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/users/Profile';
import ProductList from './components/products/ProductList';
// import ProtectedRoute from './route/ProtectedRoute';
// import ProtectedComponent from './components/security/ProtectedComponent';
import PublicRoute from './route/PublicRoute';
import { ProductProvider } from './components/context/ProductContext';

const App = () => {
  return (
    <UserProvider>
      <ProductProvider>
      <Router>
      <div className="App">
        <Header/>
        <Navbar/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path="/login" element={<PublicRoute component={Login} />} />
            {/* <Route path="/protected" element={<ProtectedRoute component={ProtectedComponent} />} /> */}
            <Route path='/register' element={<Register/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/products' element={<ProductList/>}/>
          </Routes>
        <Footer/>
      </div>
      </Router>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;
