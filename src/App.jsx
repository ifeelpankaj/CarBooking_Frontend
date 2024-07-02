import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import { useMeQuery } from './redux/api/userApi';
import { userExist, userNotExist } from './redux/reducer/userReducer';

// import { userExist } from './redux/reducer/userReducer';



//Lazy Loading
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Cabs = lazy(() => import("./pages/Cabs"));

const App = () => {
  const dispatch = useDispatch();
  //User data comming from get request from server and verfing with cookies
  const {data} = useMeQuery();
  
    useEffect(() => {
      const isUserVerified = data?.user?.verified || false;
      if ( isUserVerified && data) {
        dispatch(userExist(data));
      } else {
        
        dispatch(userNotExist());
      }
    }, [data, dispatch]);
    
  
  const { user } = useSelector(
    (state) => state.auth
  );
  

  return (
   
    <Router>
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route element={<ProtectedRoute isAuthenticated={user ? false : true} />}>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
          </Route>
          <Route path='/cabs' element={<Cabs />} />



        </Routes>
      </Suspense>
      <Toaster position='top-center' />
    </Router>

  )
}

export default App