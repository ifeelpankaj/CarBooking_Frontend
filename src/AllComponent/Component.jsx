import React from "react";
import { motion, AnimatePresence, color } from 'framer-motion';
import PropTypes from 'prop-types';
import { FaCalculator, FaCalendar, FaCar, FaCheckCircle, FaCreditCard, FaDollarSign, FaExclamationTriangle, FaFlagCheckered, FaHashtag, FaIdCard, FaList, FaMapMarker, FaTags, FaUser, FaUserFriends, FaWallet } from 'react-icons/fa';
import { MdConfirmationNumber } from 'react-icons/md';
import { DateUtils } from "../utils/DateUtils";




export const JourneySection = ({ order }) => (
    <section className="booking_booking-detail__journey">
        <div className="booking_journey-card">
            <div className="booking_journey-card__path">
                <div className="booking_journey-point booking_journey-point--from">
                    <i className="fas fa-map-marker-alt"><FaMapMarker /></i>
                    <h3>From</h3>
                    <p>{order.exactLocation || order.pickupLocation}</p>
                </div>
                <div className="booking_journey-line"></div>
                <div className="booking_journey-point booking_journey-point--to">
                    <i className="fas fa-flag-checkered"><FaFlagCheckered /></i>
                    <h3>To</h3>
                    <p>{order.destination}</p>
                </div>
            </div>
            <div className="booking_journey-card__info">
                <InfoItem icon={FaCalendar} label="Departure" value={DateUtils.formatShortDate(order.departureDate, false)} />
                <InfoItem icon={FaTags} label="Booking Type" value={order.bookingType} />
                <InfoItem icon={FaUser} label="Passengers" value={order.numberOfPassengers} />
            </div>
        </div>
    </section>
);

export const PassengersSection = ({ passengers }) => (
    <section className="booking_booking-detail__passengers">
        <h2>Passenger Details</h2>
        <div className="booking_passengers-list">
            {passengers.map((passenger) => (
                <div key={passenger._id} className="booking_passenger-card">
                    <div className="booking_passenger-card__avatar">{passenger.firstName[0]}{passenger.lastName[0]}</div>
                    <div className="booking_passenger-card__info">
                        <h3>{passenger.firstName} {passenger.lastName}</h3>
                        <p>{passenger.gender}, {passenger.age || 'N/A'} years old</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export const PaymentSection = ({ order }) => (
    <section className="booking_booking-detail__payment">
        <h2>Payment Details</h2>
        <div className="booking_payment-card">
            <div className="booking_payment-card__method">
                <i className="fas fa-credit-card"><FaCreditCard /></i>
                <h3>Method</h3>
                <p>{order.paymentMethod}</p>
            </div>
            <div className="booking_payment-card__amount">
                <i className="fas fa-dollar-sign"><FaDollarSign /></i>
                <h3>Amount Paid</h3>
                <p style={{ color: "green" }}>₹ {order.paidAmount}</p>
            </div>
            <div className="booking_payment-card__amount">
                <i className="fas fa-dollar-sign"><FaWallet /></i>
                <h3>Amount Remaining</h3>
                <p style={{ color: "red" }}>₹ {(order.bookingAmount - order.paidAmount)}</p>
            </div>
            <div className="booking_payment-card__status">
                <i className="fas fa-info-circle"><FaCalculator /></i>
                <h3>Total Amount</h3>
                <p style={{ color: "black" }}>₹ {order.bookingAmount}</p>
            </div>
            {order.paymentMethod !== "Cash" && (
                <div className="booking_payment-card__id">
                    <i className="fas fa-hashtag"><FaHashtag /></i>
                    <h3>Transaction ID</h3>
                    <p>{order.razorpayOrderId}</p>
                </div>
            )}
            <div className="booking_payment-card__status">
                <i className="fas fa-info-circle">{order.paymentStatus !== "Paid" ? <FaExclamationTriangle /> : <FaCheckCircle />}</i>
                <h3>Payment Status</h3>
                <p style={order.paymentStatus !== "Paid" ? { color: "red" } : { color: "green" }}>
                    ₹ {order.paymentStatus}
                </p>
            </div>
        </div>
    </section>

);

export const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="info-item">
        <i className={`fas ${Icon}`}><Icon /></i>
        <span className="info-item__label">{label}</span>
        <span className="info-item__value">{value}</span>
    </div>
);

export const AdminInfoItem = ({ icon: Icon, label, value }) => (
    <div className="info-item">
        {Icon && <Icon />}
        <span className="info-item__label">{label}</span>
        <span className="info-item__value">{value}</span>
    </div>
);

export const DriverCard = ({ driver }) => {
    if (!driver) return <p>Loading Driver Data...</p>;

    const { email, username, phoneNumber, avatar, cab: { modelName, photos, cabNumber, capacity } } = driver;

    return (
        <section className="admin_booking-detail__driver">
            <h2>Driver Information</h2>
            <section className="admin_booking-detail__driver-info">
                <div className="admin_booking_driver-card">

                    {avatar?.url ? <img src={avatar?.url} alt={driver.username} className="admin_booking-driver-card__avatar" /> :
                        <div className="admin_booking-passenger-card__avatar">{(driver.username[0]).toUpperCase()}</div>
                    }

                </div>
                <div className="admin_booking-driver-card__info">
                    <AdminInfoItem label="Email" value={email} />
                    <AdminInfoItem label="Username" value={username} />
                    <AdminInfoItem label="Phone Number" value={phoneNumber} />
                </div>
            </section>
            <section className="admin_booking-booking-detail__ride">
                <h2>Your Ride</h2>
                <div className="admin_booking-cab-card">
                    <Carousel images={photos || []} />
                    <div className="admin_booking-cab-card__info">
                        <AdminInfoItem icon={FaCar} label="Model" value={modelName} />
                        <AdminInfoItem icon={MdConfirmationNumber} label="Number" value={cabNumber} />
                        <AdminInfoItem icon={FaUserFriends} label="Capacity" value={capacity} />

                    </div>
                </div>
            </section>
        </section>
    );
};

export const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const containerRef = React.useRef(null);

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    React.useEffect(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            containerRef.current.scrollTo({
                left: currentIndex * containerWidth,
                behavior: 'smooth'
            });
        }
    }, [currentIndex]);

    return (
        <div className="carousel">
            <button className="carousel__button carousel__button--left" onClick={handlePrevClick}>
                &lt;
            </button>
            <div className="carousel__image-container" ref={containerRef}>
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image.url}
                        alt={`Slide ${index + 1}`}
                        className="carousel__image"
                    />
                ))}
            </div>
            <button className="carousel__button carousel__button--right" onClick={handleNextClick}>
                &gt;
            </button>
        </div>
    );
};

export const DriverInfo = ({ driver,CabId }) => (
    <div className="driver_info">
        <p>Since: {DateUtils.formatShortDate(driver.createdAt, false)}</p>
        <p>Name: {driver.username}</p>
        <p>Cab ID: {CabId}</p>

        <p>Email: {driver.email}</p>
        <p>Phone No: {driver.phoneNumber}</p>
        <div className="driver_info_document-status">
            <span>Document Submitted: {driver.isDocumentSubmited ? "Yes" : "No"}</span>
            <span>Have Car: {driver.haveCab ? "Yes" : "No"}</span>
        </div>
    </div>
);

export const CarDetails = ({ cab }) => (
    <section className="admin_driver-detail__ride">
        <h2>Your Ride</h2>
        <div className="admin_driver_cab-card">
            <Carousel images={cab.photos || []} />
            <div className="admin_driver_cab-card__info">
                <AdminInfoItem icon={FaCar} label="Model" value={cab.modelName} />
                <AdminInfoItem icon={FaIdCard} label="Number" value={cab.cabNumber} />
                <AdminInfoItem icon={FaUserFriends} label="Capacity" value={cab.capacity} />
                <AdminInfoItem icon={FaList} label="Features" value={cab.feature} />
            </div>
        </div>
    </section>
);

const DocumentPreview = ({ document }) => {
    const isPDF = document.url.toLowerCase().endsWith('.pdf');

    return (
        <motion.div
            className="document-preview"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
        >
            {isPDF ? (
                <embed src={document.url} type="application/pdf" width="100%" height="300px" />
            ) : (
                <img src={document.url} alt={`${document.docName} preview`} style={{ maxWidth: '100%', height: 'auto' }} />
            )}
        </motion.div>
    );
};

DocumentPreview.propTypes = {
    document: PropTypes.shape({
        url: PropTypes.string.isRequired,
        docName: PropTypes.string.isRequired,
    }).isRequired,
};

export const Documents = ({ documents, showDocument, toggleShowDocument, DocName }) => (
    <div className="admin_driver_documents">
        <h2>Documents</h2>
        {documents.map((document, index) => (
            <div key={document._id} className="admin_driver_document">
                <p>{DocName[index]}</p>
                <a href={document.url} target="_blank" rel="noopener noreferrer">Download</a>
                <button onClick={() => toggleShowDocument(document._id)}>
                    {showDocument === document._id ? 'Hide' : 'Show'}
                </button>
                <AnimatePresence>
                    {showDocument === document._id && <DocumentPreview document={document} />}
                </AnimatePresence>
            </div>
        ))}
    </div>
);


const BookingList = ({ title, bookings }) => (
    <div className="admin_driver_booking-list">
        <h2>{title}</h2>
        {bookings.length === 0 ? (
            <p>No bookings available.</p>
        ) : (
            bookings.map((booking) => (
                <div key={booking.orderId} className="admin_driver_booking-item">
                    <p><strong>Order ID:</strong> {booking.orderId}</p>
                    <p><strong>Departure:</strong> {DateUtils.formatShortDate(booking.departureDate)}</p>
                    <p><strong>Drop-off:</strong> {DateUtils.formatShortDate(booking.dropOffDate)}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                </div>
            ))
        )}
    </div>
);

BookingList.propTypes = {
    title: PropTypes.string.isRequired,
    bookings: PropTypes.arrayOf(
        PropTypes.shape({
            orderId: PropTypes.string.isRequired,
            departureDate: PropTypes.string.isRequired,
            dropOffDate: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
        })
    ).isRequired,
    formatDate: PropTypes.func.isRequired,
};

export const BookingSection = ({ cab, formatDate }) => (
    <div className="admin_driver_bookings">
        <BookingList title="Past Bookings" bookings={cab.pastBookings} formatDate={formatDate} />
        <BookingList title="Upcoming Bookings" bookings={cab.upcomingBookings} formatDate={formatDate} />
    </div>
);