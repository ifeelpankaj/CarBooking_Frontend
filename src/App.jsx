import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {  useSelector } from 'react-redux';
import { useUser } from './hooks/useUser';
import Loader from './components/Loader';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute'; 


// Lazy loading components for sending data in chunks 
const Home = lazy(() => import('./pages/Home'));
const AuthForm = lazy(() => import('./pages/AuthForm'));
const Cabs = lazy(() => import("./pages/Cabs"));
const Payment = lazy(() => import("./pages/Payment"));
const Profile = lazy(() => import("./pages/Profile"));
const Booking = lazy(() => import("./pages/Booking"));
const BookingDetail = lazy(() => import("./pages/BookingDetail"));


//Driver
const MyRide = lazy(() => import("./driver/MyRide"));
const MyRideDetails = lazy(() => import("./driver/MyRideDetails"));
const DriverHome = lazy(() => import('./driver/DriverHome'));
const DriverBooking = lazy(() => import ('./driver/DriverBooking'));



//Admin
const AdminHome = lazy(() => import('./Admin/AdminHome')); 
const Customer = lazy(() => import('./Admin/Customer'));
const Dashboard = lazy(() => import('./Admin/Dashboard'));
const OurCabs = lazy(() => import('./Admin/OurCabs'));
const Bookings = lazy(() => import('./Admin/Bookings'));
const Drivers = lazy(() => import('./Admin/Drivers'));
const ManageBookings = lazy(() => import('./Admin/ManageBookings'));
const ManageDrivers = lazy(() => import('./Admin/ManageDrivers'));
const ManageCustomer = lazy(() => import('./Admin/ManageCustomer'));
const ManageCabs = lazy(() => import('./Admin/ManageCabs'));








const RoleBasedHome = () => {
  const { user } = useSelector((state) => state.auth);

  switch (user?.role) {
    case 'Admin':
      return <AdminHome />;
    case 'Driver':
      return <DriverHome />;
    default:
      return <Home />;
  }
};

const App = () => {
  
  const { isLoading } = useUser();
  const { user } = useSelector((state) => state.auth);

  // if(!user){
  //   return <Loader/>
  // }

  if (isLoading) {
    return <Loader />;
  }


  return (
    <Router>
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<RoleBasedHome />} />
          <Route path="/login" element={user ? <Navigate to="/profile" /> : <AuthForm />} />
          <Route path="/signup" element={user ? <Navigate to="/profile" /> : <AuthForm />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/cabs" element={<ProtectedRoute roles={["Passenger"]}><Cabs /></ProtectedRoute>} />
          <Route path="/cabs/:id" element={<ProtectedRoute roles={["Passenger"]}><Payment /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute roles={["Passenger"]}><Booking /></ProtectedRoute>} />
          <Route path="/booking/:id" element={<ProtectedRoute roles={["Passenger","Driver","Admin"]}><BookingDetail /></ProtectedRoute>} />
          <Route path="/myRide" element={<ProtectedRoute roles={["Driver"]}><MyRide /></ProtectedRoute>} />
          <Route path="/mybookings" element={<ProtectedRoute roles={["Driver"]}><DriverBooking /></ProtectedRoute>} />

          <Route path="/myRide/:id" element={<ProtectedRoute roles={["Driver"]}><MyRideDetails /></ProtectedRoute>} />

          {/* Admin Route  */}
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={["Admin"]}><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute roles={["Admin"]}><Customer /></ProtectedRoute>} />
          <Route path="/admin/transaction" element={<ProtectedRoute roles={["Admin"]}><Bookings /></ProtectedRoute>} />
          <Route path="/admin/drivers" element={<ProtectedRoute roles={["Admin"]}><Drivers /></ProtectedRoute>} />
          <Route path="/admin/cabs" element={<ProtectedRoute roles={["Admin"]}><OurCabs /></ProtectedRoute>} />
          <Route path="/admin/manage-booking/:id" element={<ProtectedRoute roles={["Admin"]}><ManageBookings /></ProtectedRoute>} />
          <Route path="/admin/manage-driver/:id" element={<ProtectedRoute roles={["Admin"]}><ManageDrivers /></ProtectedRoute>} />
          <Route path="/admin/manage-customer/:id" element={<ProtectedRoute roles={["Admin"]}><ManageCustomer /></ProtectedRoute>} />
          <Route path="/admin/manage-cabs/:id" element={<ProtectedRoute roles={["Admin"]}><ManageCabs /></ProtectedRoute>} />





          <Route path='/loader' element={<Loader/>}/>
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </Suspense>
      {/* <Footer/> */}
      <Toaster position="top-center" />
    </Router>
  );
};

export default App;