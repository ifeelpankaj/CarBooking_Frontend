import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DriverRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'Driver') {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default DriverRoute;

