import { HStack, Box } from '@chakra-ui/react';
import { useRadio, useRadioGroup } from '@chakra-ui/react';
import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom';


function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" cursor="pointer">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "teal.600",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}
const Home = () => {

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [cabType, setCabType] = useState('one-way');

  const navigate = useNavigate(); 

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('Form data:', { from, to, pickupDate, pickupTime, cabType });
    navigate('/cabs');
  };

  const options = ['One Way', 'Round Trip'];

  // Use the useRadioGroup hook here
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'One Way',
    onChange: (value) => setCabType(value),
  });
  const group = getRootProps()

  return (
    <Fragment>


      <div className="container">
        <h1 className="title">Book Online Cab</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="from">From:</label>
            <input
              type="text"
              id="from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="to">To:</label>
            <input
              type="text"
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pickupDate">Pickup Date:</label>
            <input
              type="date"
              id="pickupDate"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pickupTime">Pickup Time:</label>
            <input
              type="time"
              id="pickupTime"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </div>
          <div>
            <HStack spacing={4} {...group}>
              {options.map((value) => (
                <RadioCard key={value} value={value} {...getRadioProps({ value })}>
                  {value}
                </RadioCard>
              ))}
            </HStack>
          </div>
          <button type="submit">Search Cabs</button>
        </form>
      </div>

    </Fragment>
  )
}

export default Home