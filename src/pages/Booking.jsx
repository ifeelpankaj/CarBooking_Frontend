import React, { Fragment } from 'react';
import { useMyOrderQuery } from '../redux/api/orderApi';
import OrderCard from '../cards/OrderCard';
import NotFound from '../components/NotFound';
import Loader from '../components/Loader';


const Booking = () => {
  const { data: Order, isLoading } = useMyOrderQuery();
  console.log(Order)
  if(!Order){
    return <NotFound/>
  }

  if (isLoading) {
    return <Loader/>;
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
