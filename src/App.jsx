import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useUser } from './hooks/useUser';




//Lazy Loading
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Cabs = lazy(() => import("./pages/Cabs"));
const CabDetail = lazy(() => import("./pages/CabDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const Booking = lazy(() => import("./pages/Booking"));
const BookingDetail = lazy(() => import("./pages/BookingDetail"));
const MyRide = lazy(() => import("./driver/MyRide"));
const MyRideDetails = lazy(() => import("./driver/MyRideDetails"));




//Driver Route
const DriverHome = lazy(() => import('./driver/DriverHome'))



const App = () => {
  const { isLoading } = useUser();
  const { user } = useSelector((state) => state.auth);




  if (isLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={user?.role === 'Driver' ? <DriverHome /> : <Home />} />
          <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/profile" /> : <SignUp />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route 
          path="/cabs" element={user && user.role === "Passenger" || "Admin" ? <Cabs /> : <Navigate to="/login" />} 
          />
          <Route path="/cabs/:id" element={user && user.role === "Passenger" || "Admin" ? <CabDetail /> : <Navigate to="/login" />} />
          <Route path="/bookings" element= {user && user.role === "Passenger" || "Admin" ? <Booking /> : <Navigate to="/login" />}/>
          <Route path="/booking/:id" element={user && user.role === "Passenger" || "Admin" ?<BookingDetail /> : <Navigate to="/login"/>} />


          <Route path="/myRide" element={user && user.role === "Driver" || "Admin" ?<MyRide /> : <Navigate to="/profile"/>} />

          <Route path="/myRide/:id" element={user && user.role === "Driver" || "Admin" ?<MyRideDetails /> : <Navigate to="/profile"/>} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" />
    </Router>
  );
};

export default App