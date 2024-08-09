import React from 'react'
import { useDriverBookingQuery } from '../redux/api/driverApi';
import Loader from '../components/Loader';
import OrderCard from '../cards/OrderCard';

const DriverBooking = () => {
    const { data: bookingsData, isLoading ,refetch} = useDriverBookingQuery();
    if (isLoading || !bookingsData) {
        return <Loader />;
    }
    const completedBookings = bookingsData?.data?.completed;
    if(completedBookings){
        refetch();
    }
    return (
        <div className="booking-container">
            {completedBookings.map((order) => (
                <OrderCard key={order._id} order={order} driver={true} />
            ))}
        </div>
    )
}

export default DriverBooking