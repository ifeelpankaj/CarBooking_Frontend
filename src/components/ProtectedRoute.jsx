// import { Navigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const ProtectedRoute = ({ children, roles = [] }) => {
//   const { user } = useSelector((state) => state.auth);
//   const location = useLocation();
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location.pathname }} replace />;
//   }

//   if (roles.length > 0 && !roles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Check localStorage if user is not in Redux state
  const storedUser = user || JSON.parse(localStorage.getItem('user'));

  if (!storedUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles.length > 0 && !roles.includes(storedUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

