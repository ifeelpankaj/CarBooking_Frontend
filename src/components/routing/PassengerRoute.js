import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PassengerRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'Passenger') {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default PassengerRoute;