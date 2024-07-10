import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCabDetailQuery } from '../redux/api/cabApi';
import { useParams } from 'react-router-dom';
import Carousel from '../components/Carousel';
import toast from 'react-hot-toast';
import { useBookCabMutation, usePaymentVerificationMutation } from '../redux/api/orderApi';

const CabDetail = () => {
    const bookingData = useSelector((state) => state.cabBooking);
    const { id } = useParams();
    const { data: cabs, isLoading } = useCabDetailQuery(id);

    const [paymentMethod, setPaymentMethod] = useState('Online'); // Default payment method
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifyPayment] = usePaymentVerificationMutation();
  const [bookCab] = useBookCabMutation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!cabs || !cabs.cab) {
        return <div>Loading...</div>;
    }

    const imageGallery = cabs.cab.photos || [];
    const cabInfo = cabs.cab || "Hey";


    //payment
    const submitHandler = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const orderDetails = {
            bookingType: bookingData.cabType,
            departureDate: bookingData.pickupDate,
            pickupLocation: bookingData.from,
            destination: bookingData.to,
            numberOfPassengers: 1,
            bookingStatus: 'Pending',
            paymentMethod,
            paymentStatus: 'Pending',
            passengers: [{ name: 'John Doe', age: 30 }],
            bookingAmount: 1121,
        };

        try {
            // First, create the order
            const { data } = await bookCab(orderDetails);

            if (paymentMethod === 'Online' || paymentMethod === 'Hybrid') {
                // If online or hybrid payment, initiate Razorpay
                const options = {
                    key: 'rzp_test_FpNuklHbR3ShlV',
                    amount: data.order.amount, // Use the amount from the created order
                    currency: "INR",
                    name: 'Your Company Name',
                    description: 'Test Transaction',
                    order_id: data.order.id,
                    handler: async function (response) {
                        await verifyPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            orderOptions: data.orderOptions,
                        });
                        toast('Payment verified successfully!');
                    },
                    theme: {
                        color: '#F37254',
                    },
                };
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            } else if (paymentMethod === 'Cash') {
                // For cash payment, just show a success message
                toast('Order placed successfully. Please pay cash on delivery.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast('Failed to place order');
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <main className='booking-review-main'>
            <div className='booking-summary'>
                <h2 className='booking-heading'>Review Your Booking</h2>
                <p className='booking-info'>
                    {bookingData.from} - {bookingData.to} | {bookingData.cabType} | {bookingData.pickupDate} on {bookingData.pickupTime} IST
                </p>
            </div>
            <div className='details-container'>
                <section className='cab-details'>
                    <div className='cab-image-container'>
                        <h1 className='section-heading'>Photo Carousel</h1>
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
                        <p className='section-content'>Enter pick up location</p>
                        <input className='pickup-input' type='text' />
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
                    <h1 className='amount-value'>₹1121</h1>
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
                        <label htmlFor="hybrid-payment">Pay Partial Amount: ₹700 (Hybrid)</label>
                    </div>
                    <div className='payment-option'>
                        <input 
                            type="radio" 
                            name="payment" 
                            id="full-payment"
                            checked={paymentMethod === 'Online'}
                            onChange={() => setPaymentMethod('Online')}
                        />
                        <label htmlFor="full-payment">Pay Full Amount: ₹1121 (Online)</label>
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
