import React from 'react';
import { Link } from 'react-router-dom';
import { DateUtils } from '../utils/DateUtils';



const OrderCard = ({ order,driver = false }) => {
  const date = DateUtils.formatShortDate((order.createdAt),false);
 
  
  return (
    <div className="order_order-card">
    <div className="order_order-header">
      {driver ? (<span className={`status ${order.bookingStatus.toLowerCase()}`}>{order.driverShare[0].status}</span>):(<span className={`status ${order.bookingStatus.toLowerCase()}`}>{order.bookingStatus}</span>)}
      <h3>{order.bookingType}</h3>
    </div>
    <div className="order_order-body">
      <div className="order_order-route">
        <div className="order_location from">{order.exactLocation ? order.exactLocation : order.pickupLocation }</div>
        <div className="order_route-line"></div>
        <div className="order_location to">{order.destination}</div>
      </div>
      <div className="order_order-details">
        <p className="order_date">{date}</p>
        <p className="order_id">Booking ID: {order._id}</p>
        <p className="order_payment">{order.paymentMethod}</p>
      </div>
      <div className="order_order-amount">
        {driver ? (<p className="order_total">Earning: ₹{order.driverShare[0].driverCut}</p>): (<p className="total">Total: ₹{order.bookingAmount}</p>)}
        {driver ? (<p className="order_paid">Paid Via: ₹{order.driverShare[0].Via}</p>):(<p className="order_paid">Paid: ₹{order.paidAmount}</p>)}
      </div>
    </div>
    {driver ? <div className="order_detail-button">{order.bookingStatus}</div> : <Link className="order_detail-button"  to={`/booking/${order._id}`}>View Details</Link>}
    
  </div>
  );
};

export default OrderCard;
