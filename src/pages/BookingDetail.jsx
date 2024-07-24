import React, { Fragment } from 'react'
import { useOrderDetailQuery } from '../redux/api/orderApi'
import { useParams } from 'react-router-dom';
import { useCabDetailQuery } from '../redux/api/cabApi';
import Carousel from '../components/Carousel';
import {  useMeIdQuery } from '../redux/api/userApi';
import Loader from '../components/Loader';



const BookingDetail = () => {
  const { id } = useParams();
  const { data: orderDetail, isLoading: orderLoading } = useOrderDetailQuery(id);
  const bookedCabId = orderDetail?.order?.bookedCab;
  const { data: cabData, isLoading: cabLoading } = useCabDetailQuery(bookedCabId, {
    skip: !bookedCabId,  // Skip the query if bookedCabId is not available
  });
  const driverId = cabData?.cab?.belongsTo;

  const { data: userData, isLoading: userLoading } = useMeIdQuery(driverId, {
    skip: !driverId,  // pass the query if driverId is not available
  });

  
  
  
  if (orderLoading || cabLoading || userLoading) {
    return <Loader/>;
  }
  
  if (!orderDetail?.order) {
    return <div className="error">Error loading  order details</div>;
  }
  if ( !cabData?.cab || !userData?.user) {
    return <div className="error">Error loading  cab details</div>;
  }
  if ( !userData?.user) {
    return <div className="error">Error loading  driver details</div>;
  }
  
  
  const { order } = orderDetail;
  const { cab: cabInfo } = cabData;
  const { user } = userData;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="booking-detail">
      <h1 className="booking-detail__title">Your Journey Details</h1>
      
      <section className="booking-detail__journey">
        <div className="journey-card">
          <div className="journey-card__path">
            <div className="journey-point journey-point--from">
              <i className="fas fa-map-marker-alt"></i>
              <h3>From</h3>
              <p>{order.exactLocation || order.pickupLocation}</p>
            </div>
            <div className="journey-line"></div>
            <div className="journey-point journey-point--to">
              <i className="fas fa-flag-checkered"></i>
              <h3>To</h3>
              <p>{order.destination}</p>
            </div>
          </div>
          <div className="journey-card__info">
            <InfoItem icon="fa-calendar" label="Departure" value={formatDate(order.departureDate)} />
            <InfoItem icon="fa-tag" label="Booking Type" value={order.bookingType} />
            <InfoItem icon="fa-users" label="Passengers" value={order.numberOfPassengers} />
          </div>
        </div>
      </section>

      <section className="booking-detail__passengers">
        <h2>Passenger Details</h2>
        <div className="passengers-list">
          {order.passengers.map((passenger, index) => (
            <div key={passenger._id} className="passenger-card">
              <div className="passenger-card__avatar">{passenger.firstName[0]}{passenger.lastName[0]}</div>
              <div className="passenger-card__info">
                <h3>{passenger.firstName} {passenger.lastName}</h3>
                <p>{passenger.gender}, {passenger.age || 'N/A'} years old</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="booking-detail__ride">
        <h2>Your Ride</h2>
        <div className="cab-card">
          <Carousel images={cabInfo.photos || []} />
          <div className="cab-card__info">
            <InfoItem icon="fa-car" label="Model" value={cabInfo.modelName} />
            <InfoItem icon="fa-user-friends" label="Capacity" value={cabInfo.capacity} />
            <InfoItem icon="fa-list" label="Features" value={cabInfo.feature} />
          </div>
        </div>
      </section>

      <section className="booking-detail__payment">
        <h2>Payment Details</h2>
        <div className="payment-card">
          <div className="payment-card__method">
            <i className="fas fa-credit-card"></i>
            <h3>Method</h3>
            <p>{order.paymentMethod}</p>
          </div>
          <div className="payment-card__amount">
            <i className="fas fa-dollar-sign"></i>
            <h3>Amount Paid</h3>
            <p>₹ {order.paidAmount}</p>
          </div>
          <div className="payment-card__status">
            <i className="fas fa-info-circle"></i>
            <h3>Total Amount</h3>
            <p>₹ {order.bookingAmount}</p>
          </div>
          {order.paymentMethod !== "Cash" && (
            <div className="payment-card__id">
              <i className="fas fa-hashtag"></i>
              <h3>Razorpay ID</h3>
              <p>{order.razorpayOrderId}</p>
            </div>
          )}
        </div>
      </section>

      <section className="booking-detail__driver">
        <h2>Driver Information</h2>
        {order.bookingStatus !== 'Pending' ? (
          <div className="driver-card">
            <img src={user.avatar.url} alt={user.name} className="driver-card__avatar" />
            <div className="driver-card__info">
              <h3>{user.name}</h3>
              <InfoItem icon="fa-envelope" label="Email" value={user.email} />
              <InfoItem icon="fa-phone" label="Phone" value={user.phoneNo} />
            </div>
          </div>
        ) : (
          <div className="driver-pending">
            <i className="fas fa-hourglass-half"></i>
            <h3>Assigning Your Driver</h3>
            <p>We're working on finding the perfect driver for your journey. This may take up to 3-4 hours. We'll notify you via WhatsApp once a driver is assigned.</p>
          </div>
        )}
      </section>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="info-item">
    <i className={`fas ${icon}`}></i>
    <span className="info-item__label">{label}</span>
    <span className="info-item__value">{value}</span>
  </div>
);

export default BookingDetail;