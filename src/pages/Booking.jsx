import React, { Fragment } from 'react';
import { useMyOrderQuery } from '../redux/api/orderApi';
import OrderCard from '../cards/OrderCard';
import NotFound from '../components/NotFound';


const Booking = () => {
  const { data: Order, isLoading } = useMyOrderQuery();
  if(!Order){
    return <NotFound/>
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      <div className="booking-container">
        {Order.orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </Fragment>
  );
};

export default Booking;
