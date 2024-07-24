// Home1.jsx
import React from 'react';
import { useDriverBookingQuery } from '../../redux/api/driverApi';
import OrderSection from './OrderSection';
import Loader from "../Loader";


const Home1 = () => {
  const { data: bookings, isLoading } = useDriverBookingQuery();
 

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="home1">
      {bookings.length === 0 ? (
        <div>Kindly wait, we will assign you booking soon.</div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-item">
              <h3>{booking.bookingType}</h3>
              <p>Departure Date: {new Date(booking.departureDate).toLocaleString()}</p>
              <p>Destination: {booking.destination}</p>
              <p>Pickup Location: {booking.pickupLocation}</p>
              <p>Number of Passengers: {booking.numberOfPassengers}</p>

              <ul>
                {booking.passengers.map((passenger, index) => (
                  <li key={index}>{/* Display passenger details here */}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
     
    </div>
  );
};

export default Home1;
