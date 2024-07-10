import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, redirect = '/' }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to={redirect} />;
};

export default ProtectedRoute;