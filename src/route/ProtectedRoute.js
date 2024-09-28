// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../components/context/UserContext';

const ProtectedRoute = ({ component: Component }) => {
  const { user } = useUserContext();

  return user ? <Component /> : <Navigate to="/payment" />;
};

export default ProtectedRoute;
