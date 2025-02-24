import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCabDetailQuery } from '../redux/api/cabApi';
import { useNavigate, useParams } from 'react-router-dom';
import Carousel from '../components/Carousel';
import toast from 'react-hot-toast';
import { useBookCabMutation, usePaymentVerificationMutation } from '../redux/api/orderApi';
import Loader from '../components/Loader';

const Payment = () => {
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
            dropOffDate:bookingData.dropOffDate || bookingData.pickupDate,
            pickupLocation: bookingData.from,
            destination: bookingData.to,
            numberOfPassengers: passengers.length,
            bookingStatus: 'Pending',
            paymentMethod,
            passengers,
            bookingAmount: bookingData.distance * cabInfo.rate,
        };

        try {
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
        <main className='book_review_main'>
            <div className='book_summary'>
                <h2 className='book_heading'>Review Your Booking</h2>
                <p className='book_info'>
                    {bookingData.from} - {bookingData.to} | {bookingData.cabType} | {formatDate(bookingData.pickupDate)} on {bookingData.pickupTime} IST
                </p>
            </div>
            <div className='book_details_container'>
                <section className='book_cab_details'>
                    <div className='book_cab_image_container'>
                        <h1 className='book_section_heading'>Your Ride Images</h1>
                        <Carousel images={imageGallery} />
                    </div>
                    <div className='book_driver_info'>
                        <h1 className='book_cab_model_name'>{cabInfo.modelName}</h1>
                        <h1 className='book_section_heading'>About our drivers</h1>
                        <p className='book_section_content'>100% of drivers are police verified, licensed, and audited</p>
                    </div>
                    <div className='book_tour_inclusions'>
                        <h1 className='book_section_heading'>Inclusions & exclusions</h1>
                        <p className='book_section_content'>Included in your fare</p>
                    </div>
                    <div className='book_pickup_info'>
                        <h1 className='book_section_heading'>Enter exact pick up location</h1>
                        <input
                            className='book_pickup_input'
                            type='text'
                            value={exactLocation}
                            onChange={(e) => setExactLocation(e.target.value)}
                            placeholder="Enter your exact pickup location"
                        />
                    </div>
                    <div className='book_passenger_info'>
                        <h1 className='book_section_heading'>Enter Passenger Details</h1>
                        {passengers.map((passenger, index) => (
                            <div key={index} className='book_passenger_inputs'>
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
                        <button type='button' onClick={addPassenger} className='book_add_passenger_btn'>Add Another Passenger</button>
                    </div>
                    <div className='book_cancellation_policy'>
                        <h1 className='book_section_heading'>Cancellation Policy</h1>
                        <p className='book_section_content'>Enjoy Worry-Free Booking with Free Cancellation!</p>
                    </div>
                    <div className='book_additional_info'>
                        <h1 className='book_section_heading'>Other Information</h1>
                        <ul className='book_info_list'>
                            <li>AC will be switched off in hilly areas</li>
                            <li>Only one pick-up, one drop & one pit stop for meal is included</li>
                        </ul>
                    </div>
                </section>
                <section className='book_payment_details'>
                    <div className='book_total_amount'>
                        <h1 className='book_section_heading'>Total Amount</h1>
                        <h1 className='book_amount_value'>₹{TotalAmount}</h1>
                    </div>
                    <div className='book_payment_options'>
                        <h1 className='book_section_heading'>Payment Options</h1>
                        <div className='book_payment_option'>
                            <input
                                type="radio"
                                name="payment"
                                id="hybrid-payment"
                                checked={paymentMethod === 'Hybrid'}
                                onChange={() => setPaymentMethod('Hybrid')}
                            />
                            <label htmlFor="hybrid-payment">Pay Partial Amount : ₹ {TotalAmount * 0.1}</label>
                        </div>
                        <div className='book_payment_option'>
                            <input
                                type="radio"
                                name="payment"
                                id="full-payment"
                                checked={paymentMethod === 'Online'}
                                onChange={() => setPaymentMethod('Online')}
                            />
                            <label htmlFor="full-payment">Pay Full Amount : ₹ {TotalAmount}</label>
                        </div>
                        <div className='book_payment_option'>
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
                    <button onClick={submitHandler} disabled={isProcessing} className='book_payment_button'>
                        Place Order
                    </button>
                    <div className='book_contact_info'>
                        <p>Contact us: +91 9999999999 | xyz@domain.com</p>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Payment;