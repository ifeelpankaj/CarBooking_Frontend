import React from 'react'
import { useOrderDetailQuery } from '../redux/api/orderApi'
import { useParams } from 'react-router-dom';
import { useCabDetailQuery } from '../redux/api/cabApi';
import Carousel from '../components/Carousel';
import { useMeIdQuery } from '../redux/api/userApi';
import Loader from '../components/Loader';
import { FaCar, FaEnvelope, FaHourglassHalf, FaList, FaPhone, FaUserFriends } from 'react-icons/fa';
import { InfoItem, JourneySection, PassengersSection, PaymentSection } from '../AllComponent/Component';


const BookingDetail = () => {
  const { id } = useParams();
  const { data: orderDetail, isLoading: orderLoading } = useOrderDetailQuery(id, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const bookedCabId = orderDetail?.order?.bookedCab;
  const { data: cabData, isLoading: cabLoading } = useCabDetailQuery(bookedCabId, {
    skip: !bookedCabId,
  });
  const driverId = cabData?.cab?.belongsTo;

  const { data: userData, isLoading: userLoading } = useMeIdQuery(driverId, {
    skip: !driverId,
  });

  


  if (orderLoading || cabLoading || userLoading) {
    return <Loader />;
  }

  if (!orderDetail?.order) {
    return <div className="error">Error loading  order details</div>;
  }
  if (!cabData?.cab || !userData?.user) {
    return <div className="error">Error loading  cab details</div>;
  }
  if (!userData?.user) {
    return <div className="error">Error loading  driver details</div>;
  }


  const { order } = orderDetail;
  const { cab: cabInfo } = cabData;
  const { user } = userData;


  return (
    <div className="booking_booking-detail">
      <h1 className="booking_booking-detail__title">Your Journey Details</h1>

      <JourneySection order={order} />
      <PassengersSection passengers={order.passengers} />



      <section className="booking_booking-detail__ride">
        <h2>Your Ride</h2>
        <div className="booking_cab-card">
          <Carousel images={cabInfo.photos || []} />
          <div className="booking_cab-card__info">
            <InfoItem icon={FaCar} label="Model" value={cabInfo.modelName} />
            <InfoItem icon={FaUserFriends} label="Capacity" value={cabInfo.capacity} />
            <InfoItem icon={FaList} label="Features" value={cabInfo.feature} />
          </div>
        </div>
      </section>

      <PaymentSection order={order} />

      <section className="booking_booking-detail__driver">
        <h2>Driver Information</h2>
        {order.bookingStatus !== 'Pending' ? (
          <div className="booking_driver-card">
            {user?.avatar?.url ? <img src={user?.avatar?.url} alt={user.name} className="booking_driver-card__avatar" /> :
              <div className="booking_passenger-card__avatar">{user.username[0].toUpperCase()}</div>
            }

            <div className="booking_driver-card__info">
              <h3>{user.name}</h3>
              <InfoItem icon={FaEnvelope} label="Email" value={user.email} />
              <InfoItem icon={FaPhone} label="Phone" value={user.phoneNumber} />
            </div>
          </div>
        ) : (
          <div className="booking_driver-pending">
            <i className="fas fa-hourglass-half"><FaHourglassHalf /></i>
            <h3>Assigning Your Driver</h3>
            <p>We're working on finding the perfect driver for your journey. This may take up to 3-4 hours. We'll notify you via WhatsApp once a driver is assigned.</p>
          </div>
        )}
      </section>
    </div>
  );
};




export default BookingDetail;