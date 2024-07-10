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
    
    return (
        <main className='cab-page'>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <ul>
                        {cabs.map((cab) => (
                            <li key={cab._id}>
                                <CabCard
                                    availability="Available"
                                    belongsTo="User"
                                    email="kholiya407@gmail.com"
                                    _id={cab._id}
                                    capacity={cab.capacity}
                                    createdAt={cab.createdAt}
                                    feature={cab.feature}
                                    isReady={cab.isReady}
                                    modelName={cab.modelName}
                                    photos={cab.photos}
                                    price={(cab.rate) * distance}
                                    type={cab.type}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </main>
    );
};

export default Cabs;
