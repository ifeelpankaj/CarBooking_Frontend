import React, { useState } from 'react';
import { useCancelBookingMutation, useCompleteBookingMutation, useConfirmBookingMutation, useDriverBookingQuery } from '../../redux/api/driverApi';
import Loader from "../Loader";
import { FaMapMarkerAlt, FaMoneyBillWave, FaCreditCard, FaUserFriends,FaChevronUp,FaChevronDown, FaFlagCheckered, FaCalendarCheck, FaInfoCircle } from 'react-icons/fa';
import {DateUtils} from '../../utils/DateUtils'

import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
const DriverDashBorad = () => {
  const { data: bookingsData, isLoading: orderLoading, refetch } = useDriverBookingQuery( {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [upcomingExpanded, setUpcomingExpanded] = useState(true);
  const [confirmedExpanded, setConfirmedExpanded] = useState(true);

  if (!bookingsData || orderLoading) {
    return <Loader />;
  }
  
  const assignBookingsCount = bookingsData?.assigningCount;
  const confirmBookingsCount = bookingsData?.confirmedCount;

  const upcommingBookings = bookingsData?.data?.assigning;
  const comfirmedBookings = bookingsData?.data?.confirmed;

  const toggleUpcoming = () => {
    setUpcomingExpanded(!upcomingExpanded);
    refetch();
  };
  
  const toggleConfirmed = () => {
    setConfirmedExpanded(!confirmedExpanded);
    refetch();
  };

  return (
    <main className='driver_dashboard_container'>
 
        <div >
          <CollapsiblePanel 
            title={`Assigned Bookings [ ${assignBookingsCount} ]`}
            isExpanded={upcomingExpanded}
            onToggle={toggleUpcoming}
          >
          {assignBookingsCount !== 0 ? (
            <div>
            {upcommingBookings.map((order, index) => (
              <BookingCard key={index} order={order} upcomming={false} />
            ))}
            </div>
          ) : (
            <div>
              <h2>Kindly wait we will assign you your first booking soon</h2>
            </div>
          )}
          </CollapsiblePanel>

          <CollapsiblePanel 
            title={`Upcomming Bookings [ ${confirmBookingsCount} ]`}
            isExpanded={confirmedExpanded}
            onToggle={toggleConfirmed}
          >
             {confirmBookingsCount !== 0 ? (
            <div>
             {comfirmedBookings?.map((order, index) => (
              <BookingCard key={index} order={order} upcomming={true} />
            ))}
            </div>
          ) : (
            <div>
              <h2>Currently we do not have any upcomming booking for you !!</h2>
            </div>
          )}
           
          </CollapsiblePanel>
        </div>
     
    </main>
  );
};

const CollapsiblePanel = ({ title, isExpanded, onToggle, children }) => {
  return (
    <div className="driver_dashboard_collapsible-panel">
      <div className="driver_dashboard_panel-header" onClick={onToggle}>
        <h2>{title}</h2>
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BookingCard = ({ order, upcomming = false }) => {
  const { _id:orderId, pickupLocation, destination, driverShare, paymentMethod, paymentStatus, passengers, bookingType, departureDate } = order;


  const [confirmBooking, { isLoading: isConfirming }] = useConfirmBookingMutation();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const [completeBooking, { isLoading: isComplete }] = useCompleteBookingMutation();


  const handleAccept = async () => {
    try {

      const res = await confirmBooking({orderId}).unwrap();
      if(res.success){
        toast.success(res.message)
      }

    } catch (error) {

      toast.error(error.data.message)
    }
  };


  const handleDecline = async () => {
    try {
      const res = await cancelBooking({orderId}).unwrap();

      if(res.success){
        toast.success(res.message)
      }
    } catch (error) {
      toast.error(error.data.message)
    }
  };
  const handleComplete = async () => {
    try {
      const res = await completeBooking({orderId}).unwrap();

      if(res.success){
        toast.success(res.message)
      }
    } catch (error) {
      toast.error(error.data.message)
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="driver_dashboard_current-booking"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <div className="driver_dashboard_current-booking__card">
        <div className="driver_dashboard_current-booking__header">
          {upcomming ? <h2>Upcoming Booking</h2> : <h2>Current Booking</h2>}
          <motion.span 
            className="driver_dashboard_status-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
          >
            {paymentStatus}
          </motion.span>
        </div>
        <div className="driver_dashboard_current-booking__content">
          {[
            { icon: FaMapMarkerAlt, label: "From", value: pickupLocation },
            { icon: FaFlagCheckered, label: "To", value: destination },
            { icon: FaCalendarCheck, label: "Journey Date", value: DateUtils.formatDate(departureDate) },
            { icon: FaInfoCircle, label: "Booking type", value: bookingType },
            { icon: FaMoneyBillWave, label: "Earning", value: `₹ ${driverShare[0].driverCut}` },
            { icon: FaCreditCard, label: "Payment", value: paymentMethod },
            { icon: FaUserFriends, label: "Passengers", value: passengers.length }
          ].map((item, index) => (
            <motion.div 
              key={item.label}
              className="driver_dashboard_info-row"
              variants={itemVariants}
              transition={{ delay: index * 0.1 }}
            >
              <item.icon className="driver_dashboard_icon" />
              <div><span>{item.label}</span> <p>{item.value}</p></div>
            </motion.div>
          ))}
        </div>
        <div className="driver_dashboard_current-booking__actions">
          {!upcomming ? (<motion.button
            className="btn btn--accept"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAccept}
            disabled={isConfirming}
          >
            {isConfirming ? 'Accepting...' : 'Accept'}
          </motion.button>) : (<motion.button
            className="btn btn--accept"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            disabled={isComplete}
          >
            {isComplete ? 'Completing...' : 'Complete'}
          </motion.button> )}
          <motion.button
            className="btn btn--decline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDecline}
            disabled={isCancelling}
          >
            {isCancelling ? 'Declining...' : 'Decline'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};


export default DriverDashBorad;

