import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCabDetailQuery } from '../redux/api/cabApi';
import { useNavigate, useParams } from 'react-router-dom';
import Carousel from '../components/Carousel';
import toast from 'react-hot-toast';
import { useBookCabMutation, usePaymentVerificationMutation } from '../redux/api/orderApi';
import Loader from '../components/Loader';

const CabDetail = () => {
    const navigate = useNavigate();
    const bookingData = useSelector((state) => state.cabBooking);

    useEffect(() => {
        if (!bookingData.from || !bookingData.to) {
          toast("It seems you have reloaded the page kindly fill the details again");
          navigate("/");
        }
      }, [bookingData, navigate]);

    const { id } = useParams();
    const { data: cabs, isLoading } = useCabDetailQuery(id);

    const [paymentMethod, setPaymentMethod] = useState('Online');
    const [isProcessing, setIsProcessing] = useState(false);
    const [verifyPayment] = usePaymentVerificationMutation();
    const [bookCab] = useBookCabMutation();
    const [exactLocation, setExactLocation] = useState('');

    const [passengers, setPassengers] = useState([{ firstName: '', lastName: '', gender: '', age: '' }]);

    const addPassenger = () => {
        setPassengers([...passengers, { firstName: '', lastName: '', gender: '', age: '' }]);
    };

    const handlePassengerChange = (index, field, value) => {
        const updatedPassengers = [...passengers];
        updatedPassengers[index][field] = value;
        setPassengers(updatedPassengers);
    };

    if (isLoading) {
        return <Loader/>
    }
    if (!cabs || !cabs.cab) {
        return <Loader/>;
    }

    const imageGallery = cabs.cab.photos || [];
    const cabInfo = cabs.cab || {};
    const TotalAmount = cabInfo.rate * bookingData.distance;

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        if (!cabInfo._id) {
            toast.error('Failed to get cab information. Please try again.');
            setIsProcessing(false);
            return;
        }

        const orderDetails = {
            bookingType: bookingData.cabType,
            bookedCab: cabInfo._id,
            exactLocation,
            departureDate: bookingData.pickupDate,
            pickupLocation: bookingData.from,
            destination: bookingData.to,
            numberOfPassengers: passengers.length,
            bookingStatus: 'Pending',
            paymentMethod,
            passengers,
            bookingAmount: bookingData.distance * cabInfo.rate,
        };

        try {
            console.log(orderDetails)
            const { data } = await bookCab(orderDetails);

            if (paymentMethod === 'Online' || paymentMethod === 'Hybrid') {
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_API,
                    amount: data.amountToPay*100,
                    currency: "INR",
                    name: 'BariTours&Travel',
                    description: 'Cab Booking Payment',
                    order_id: data.order.razorpayOrderId,
                    handler: async function (response) {
                        try {
                            const verificationResponse = await verifyPayment({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            });
                            toast.success(verificationResponse.data.message);
                            navigate('/bookings');
                        } catch (verificationError) {
                            console.error('Error verifying payment:', verificationError);
                            toast.error('Failed to verify payment');
                        }
                    },
                    theme: {
                        color: '#F37254',
                    },
                };
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            } else if (paymentMethod === 'Cash') {
                if(data.success){
                    toast.success("Order Placed Successfully");
                    navigate('/bookings');
                }else{
                    toast.error("Failed to place Order");
                }
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order');
        } finally {
            setIsProcessing(false);
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
      };
    return (
        <main className='booking-review-main'>
            <div className='booking-summary'>
                <h2 className='booking-heading'>Review Your Booking</h2>
                <p className='booking-info'>
                    {bookingData.from} - {bookingData.to} | {bookingData.cabType} | {formatDate(bookingData.pickupDate)} on {bookingData.pickupTime} IST
                </p>
            </div>
            <div className='details-container'>
                <section className='cab-details'>
                    <div className='cab-image-container'>
                        <h1 className='section-heading'>Your Ride Images</h1>
                        <Carousel images={imageGallery} />
                    </div>
                    <div className='driver-info'>
                        <h1 className='cab-model-name'>{cabInfo.modelName}</h1>
                        <h1 className='section-heading'>About our drivers</h1>
                        <p className='section-content'>100% of drivers are police verified, licensed, and audited</p>
                    </div>
                    <div className='tour-inclusions'>
                        <h1 className='section-heading'>Inclusions & exclusions</h1>
                        <p className='section-content'>Included in your fare</p>
                    </div>
                    <div className='pickup-info'>
                        <h1 className='section-heading'>Enter exact pick up location</h1>
                        <input
                            className='pickup-input'
                            type='text'
                            value={exactLocation}
                            onChange={(e) => setExactLocation(e.target.value)}
                            placeholder="Enter your exact pickup location"
                        />
                    </div>
                    <div className='passenger-info'>
                        <h1 className='section-heading'>Enter Passenger Details</h1>
                        {passengers.map((passenger, index) => (
                            <div key={index} className='passenger-inputs'>
                                <input
                                    type='text'
                                    placeholder='First Name'
                                    value={passenger.firstName}
                                    onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                                />
                                <input
                                    type='text'
                                    placeholder='Last Name'
                                    value={passenger.lastName}
                                    onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                                />
                                <select
                                    value={passenger.gender}
                                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <input
                                    type='number'
                                    placeholder='Age'
                                    value={passenger.age}
                                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                                />
                            </div>
                        ))}
                        <button type='button' onClick={addPassenger} className='add-passenger-btn'>Add Another Passenger</button>
                    </div>
                    <div className='cancellation-policy'>
                        <h1 className='section-heading'>Cancellation Policy</h1>
                        <p className='section-content'></p>
                    </div>
                    <div className='additional-info'>
                        <h1 className='section-heading'>Other Information</h1>
                        <ul className='info-list'>
                            <li>AC will be switched off in hilly areas</li>
                            <li>Only one pick-up, one drop & one pit stop for meal is included</li>
                        </ul>
                    </div>
                </section>
                <section className='payment-details'>
                    <div className='total-amount'>
                        <h1 className='section-heading'>Total Amount</h1>
                        <h1 className='amount-value'>₹{TotalAmount}</h1>
                    </div>
                    <div className='payment-options'>
                        <h1 className='section-heading'>Payment Options</h1>
                        <div className='payment-option'>
                            <input
                                type="radio"
                                name="payment"
                                id="hybrid-payment"
                                checked={paymentMethod === 'Hybrid'}
                                onChange={() => setPaymentMethod('Hybrid')}
                            />
                            <label htmlFor="hybrid-payment">Pay Partial Amount : {TotalAmount * 0.1}</label>
                        </div>
                        <div className='payment-option'>
                            <input
                                type="radio"
                                name="payment"
                                id="full-payment"
                                checked={paymentMethod === 'Online'}
                                onChange={() => setPaymentMethod('Online')}
                            />
                            <label htmlFor="full-payment">Pay Full Amount : {TotalAmount}</label>
                        </div>
                        <div className='payment-option'>
                            <input
                                type="radio"
                                name="payment"
                                id="cash-payment"
                                checked={paymentMethod === 'Cash'}
                                onChange={() => setPaymentMethod('Cash')}
                            />
                            <label htmlFor="cash-payment">Pay by Cash</label>
                        </div>
                    </div>
                    <button onClick={submitHandler} disabled={isProcessing} className='payment-button'>
                        Place Order
                    </button>
                    <div className='contact-info'>
                        <p>Contact us: +91 9999999999 | xyz@domain.com</p>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default CabDetail;