import React from 'react';
import { Link } from 'react-router-dom';


const OrderCard = ({ order }) => {
  const rawDate = new Date(order.createdAt);
  const date = rawDate.toLocaleString(); 
  
  return (
    <div className="order-card">
    <div className="order-header">
      <span className={`status ${order.bookingStatus.toLowerCase()}`}>{order.bookingStatus}</span>
      <h3>{order.bookingType}</h3>
    </div>
    <div className="order-body">
      <div className="order-route">
        <div className="location from">{order.exactLocation ? order.exactLocation : order.pickupLocation }</div>
        <div className="route-line"></div>
        <div className="location to">{order.destination}</div>
      </div>
      <div className="order-details">
        <p className="date">{date}</p>
        <p className="id">Booking ID: {order._id}</p>
        <p className="payment">{order.paymentMethod}</p>
      </div>
      <div className="order-amount">
        <p className="total">Total: ₹{order.bookingAmount}</p>
        <p className="paid">Paid: ₹{order.paidAmount}</p>
      </div>
    </div>
    <Link className="detail-button"  to={`/booking/${order._id}`}>View Details</Link>
  </div>
  );
};

export default OrderCard;
