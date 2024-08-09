import React, { Fragment } from 'react';
import { motion } from 'framer-motion';
import { useMeQuery } from '../redux/api/userApi';
import DocumentVerification from '../components/driver/DocumentVerification';
import CabRegistration from '../components/driver/CabRegistration';
import OrderSection from '../components/driver/OrderSection';
import DriverDashBorad from '../components/driver/DriverDashboard';


const DriverHome = () => {
  const { data: me, isLoading, refetch } = useMeQuery();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!me?.user) {
    return <div className="error">Unable to fetch user data. Please try again.</div>;
  }

  const user = me.user;

  const handleSubmitSuccess = () => {
    refetch();
  };

  return (
    <Fragment>
      <motion.div
        className="driver_home_driver-home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Driver Dashboard</h1>
        <motion.div
          className="driver_home_content-wrapper"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {!user.documented && (
            <section className="driver_home_driver_section">
              <h2>Document Verification</h2>
              <DocumentVerification onSubmitSuccess={handleSubmitSuccess} />
            </section>
          )}
          {user.documented && !user.haveCab && (
            <section className="driver_home_driver_section">
              <h2>Cab Registration</h2>
              <CabRegistration onSubmitSuccess={handleSubmitSuccess} />
            </section>
          )}
          {user.documented && user.haveCab && <DriverDashBorad />}
        </motion.div>
      </motion.div>
      <OrderSection />
    </Fragment>
  );
};

export default DriverHome;