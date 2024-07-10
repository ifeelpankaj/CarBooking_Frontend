import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React, { Fragment, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { updateFormField } from '../redux/reducer/bookingSlice';
import { useDispatch, useSelector } from 'react-redux';


const Home = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.cabBooking);
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('OneWay');

  const dateInputRefOneWay = useRef(null);
  const timeInputRefOneWay = useRef(null);
  const dateInputRefRoundTrip = useRef(null);
  const timeInputRefRoundTrip = useRef(null);
  const dropOffDateInputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/cabs');
  };

  const handleInputChange = (field) => (event) => {
    dispatch(updateFormField({ field, value: event.target.value }));
  };

  const handleTabChange = (index) => {
    const newTripType = index === 0 ? 'OneWay' : 'RoundTrip';
    setTripType(newTripType);
    dispatch(updateFormField({ field: 'cabType', value: newTripType }));
  };
  const openDatePicker = (ref) => {
    if (ref.current) {
      ref.current.type = 'date';
      ref.current.focus();
      ref.current.click();
    }
  };
  const openTimePicker = (ref) => {
    if (ref.current) {
      ref.current.type = 'time';
      ref.current.focus();
      ref.current.click();
    }
  };

  return (
    <Fragment>
      <main className='homeContainer'>
        <div className='backgroundImage'></div>
        <div className='content'>
          <div className='formContainer'>
            <h1 className='title'>Book Online Cab</h1>
            <Tabs isFitted onChange={handleTabChange} variant='soft-rounded' colorScheme='yellow'>
              <TabList mb="1em">
                <Tab>One Way Trip</Tab>
                <Tab>Round Trip</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <form onSubmit={handleSubmit}>
                    {/* One Way Trip form content */}
                    <div className="form-group">
                      <input
                        type="text"
                        id="from"
                        placeholder="Pick-up Location"
                        value={formData.from}
                        onChange={handleInputChange('from')}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        id="to"
                        placeholder="Drop-off Location"
                        value={formData.to}
                        onChange={handleInputChange('to')}
                        required

                      />
                    </div>
                    <div className="form-group">
                      <input
                        ref={dateInputRefOneWay}
                        type="text"
                        id="pickupDate"
                        placeholder="Pick-Up Date"
                        value={formData.pickupDate}
                        onChange={handleInputChange('pickupDate')}
                        onClick={() => openDatePicker(dateInputRefOneWay)}
                        onBlur={() => { if (dateInputRefOneWay.current) dateInputRefOneWay.current.type = 'text'; }}
                        required

                      />
                    </div>
                    <div className="form-group">
                      <input
                        ref={timeInputRefOneWay}
                        type="text"
                        id="pickupTime"
                        placeholder="Pick-Up Time"
                        value={formData.pickupTime}
                        onChange={handleInputChange('pickupTime')}
                        onClick={() => openTimePicker(timeInputRefOneWay)}
                        onBlur={() => { if (timeInputRefOneWay.current) timeInputRefOneWay.current.type = 'text'; }}
                        required

                      />
                    </div>
                    <button type="submit">Search Cabs</button>
                  </form>
                </TabPanel>
                <TabPanel>
                  <form onSubmit={handleSubmit}>
                    {/* Round Trip form content */}
                    <div className="form-group">
                      <input
                        type="text"
                        id="from"
                        placeholder="Pick-up Location"
                        value={formData.from}
                        onChange={handleInputChange('from')}
                        required
                        
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        id="to"
                        placeholder="Drop-off Location"
                        value={formData.to}
                        onChange={handleInputChange('to')}
                        required

                      />
                    </div>
                    <div className="form-group">
                      <input
                        ref={dateInputRefRoundTrip}
                        type="text"
                        id="pickupDate"
                        placeholder="Pick-Up Date"
                        value={formData.pickupDate}
                        onChange={handleInputChange('pickupDate')}
                        onClick={() => openDatePicker(dateInputRefRoundTrip)}
                        onBlur={() => { if (dateInputRefRoundTrip.current) dateInputRefRoundTrip.current.type = 'text'; }}
                        required

                      />
                    </div>
                    <div className="form-group">
                      <input
                        ref={timeInputRefRoundTrip}
                        type="text"
                        id="pickupTime"
                        placeholder="Pick-Up Time"
                        value={formData.pickupTime}
                        onChange={handleInputChange('pickupTime')}
                        onClick={() => openTimePicker(timeInputRefRoundTrip)}
                        onBlur={() => { if (timeInputRefRoundTrip.current) timeInputRefRoundTrip.current.type = 'text'; }}
                        required

                      />
                    </div>
                    <div className="form-group">
                      <input
                        ref={dropOffDateInputRef}
                        type="text"
                        id="dropOffDate"
                        placeholder="Drop-Off Date"
                        value={formData.dropOffDate}
                        onChange={handleInputChange('dropOffDate')}
                        onClick={() => openDatePicker(dropOffDateInputRef)}
                        onBlur={() => { if (dropOffDateInputRef.current) dropOffDateInputRef.current.type = 'text'; }}
                        required

                      />
                    </div>
                    <button type="submit">Search Cabs</button>
                  </form>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
          <div className='textContainer'>
            <h2>BOOK A TOUR TODAY!</h2>
            <p>PLAN YOUR TOUR WITH US AND GET THE LOWEST PRICE FROM US.</p>
            <p>GET 15% DISCOUNT FOR RETURNING CUSTOMER.</p>

          </div>
        </div>
      </main>
    </Fragment>
  )
}

export default Home;


