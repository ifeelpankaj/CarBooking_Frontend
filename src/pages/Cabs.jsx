import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useShowCabsQuery } from '../redux/api/cabApi';
import CabCard from '../cards/cabCard';
import { updateFormField } from '../redux/reducer/bookingSlice';


const Cabs = () => {
    const dispatch = useDispatch();
    const formData = useSelector((state) => state.cabBooking);
    const distance = 1236;
    const { data: cabs, isLoading } = useShowCabsQuery();

    useEffect(() => {
        dispatch(updateFormField({ field: 'distance', value: distance }));
    }, [dispatch, distance]);

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
    <main 
      className='cab-page'
    >
      {isLoading ? (
        <p>
          Loading...
        </p>
      ) : (
        <div className="cab-list">
          {cabs && cabs.map((cab) => (
            <div
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
                price={(cab.rate) * distance}
                type={cab.type}
              />
            </div>
          ))}
        </div>
       )} 
    </main>
    
  );
};

export default Cabs;