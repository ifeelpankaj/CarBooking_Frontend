
import React from 'react';
import { useMeQuery } from '../redux/api/userApi';
import DocumentVerification from '../components/driver/DocumentVerification';
import CabRegistration from '../components/driver/CabRegistration';
import Home1 from '../components/driver/Home1';

const DriverHome = () => {
  const { data: me, isLoading, refetch } = useMeQuery();
  if(!me){
    return <div>Loading....</div>
  }
  const user = me?.user;

  const handleSubmitSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Unable to fetch user data. Please try again.</div>;
  }

  return (
    <div className="driver-home">
      {!user.documented && (
        <DocumentVerification onSubmitSuccess={handleSubmitSuccess} />
      )}
      {user.documented && !user.haveCab && (
        <CabRegistration onSubmitSuccess={handleSubmitSuccess} />
      )}
      {user.documented && user.haveCab && <Home1 />}
    </div>
  );
};

export default DriverHome;