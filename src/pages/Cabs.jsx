import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCalculateDistanceQuery, useShowCabsQuery } from '../redux/api/cabApi';
import CabCard from '../cards/cabCard';
import { updateFormField } from '../redux/reducer/bookingSlice';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';

const Cabs = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.cabBooking);
  const { data: cabs, isLoading: cabsLoading } = useShowCabsQuery();
  
  const { data: distanceData, isLoading: distanceLoading } = useCalculateDistanceQuery(
    { origin: formData.from, destination: formData.to },
    { skip: !formData.from || !formData.to }
  );

  useEffect(() => {
    if (distanceData && distanceData.distance) {
      const distanceInKm = parseFloat(distanceData.distance.split(' ')[0]);
      dispatch(updateFormField({ field: 'distance', value: distanceInKm }));
    }
  }, [dispatch, distanceData]);

  const isLoading = cabsLoading || distanceLoading;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className='cab-page'>
      {isLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <motion.div 
          className="cab-list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {cabs && cabs.map((cab) => (
            <motion.div
              key={cab._id}
              variants={containerVariants}
            >
              <CabCard
                availability="Available"
                _id={cab._id}
                capacity={cab.capacity}
                feature={cab.feature}
                modelName={cab.modelName}
                photos={cab.photos}
                price={(cab.rate) * (formData.distance || 0)}
                type={cab.type}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
};

export default Cabs;