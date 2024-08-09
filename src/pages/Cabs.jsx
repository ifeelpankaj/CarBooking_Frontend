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
      const distanceInKm = parseFloat(distanceData.distance.replace(/[^0-9.]/g, ''));
      dispatch(updateFormField({ field: 'distance', value: distanceInKm }));
    }
  }, [dispatch, distanceData]);

  // console.log(distanceData)
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
    <main className='cabs_page'>
      {isLoading ? (
        <div className="cabs_loader_container">
          <Loader />
        </div>
      ) : (
        <motion.div 
          className="cabs_list"
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
                cab={cab}
                price={(cab.rate) * (formData.distance || 0)}
                
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
};

export default Cabs;