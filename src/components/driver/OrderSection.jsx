import React, { Fragment } from 'react';
import { useGetPendingOrderQuery } from '../../redux/api/orderApi';
import Loader from '../Loader';


const OrderSection = () => {
  const { data: Order, isLoading } = useGetPendingOrderQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!Order || Order.orders.length === 0) {
    return <div className="no-orders">No pending orders</div>;
  }

  return (
    <Fragment>
      <h2 className="section-title">Latest Bookings</h2>
    <div className="order-section">
      <div className="order-carousel">
        {Order.orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-type">{order.bookingType}</div>
            <div className="order-info">
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>From: {order.pickupLocation}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-flag-checkered"></i>
                <span>To: {order.destination}</span>
              </div>
              <div className="info-item">
                <i className="far fa-calendar-alt"></i>
                <span>Date: {new Date(order.departureDate).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <i className="far fa-clock"></i>
                <span>Time: {new Date(order.departureDate).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Fragment>
  );
};

export default OrderSection;
