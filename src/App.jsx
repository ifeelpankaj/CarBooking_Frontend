import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import { useMeQuery } from './redux/api/userApi';
import { userExist, userNotExist } from './redux/reducer/userReducer';


//Lazy Loading
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Cabs = lazy(() => import("./pages/Cabs"));
const CabDetail = lazy(() => import("./pages/CabDetail"));



const App = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useMeQuery();

  useEffect(() => {
    if (data) {
      const isUserVerified = data.user.verified || false;
      if (isUserVerified) {
        dispatch(userExist(data));
      } else {
        dispatch(userNotExist());
      }
    } else if (isError) {
      dispatch(userNotExist());
    }
  }, [data, dispatch, isError]);

  const { user } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute isAuthenticated={!user} />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
          <Route element={<ProtectedRoute isAuthenticated={!!user} redirect="/login" />}>
            {/* Protected routes here */}
            <Route path="/cabs" element={<Cabs />} />
            <Route path="/cabs/:id" element={<CabDetail />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster position="top-center" />
    </Router>
  );
};

export default App