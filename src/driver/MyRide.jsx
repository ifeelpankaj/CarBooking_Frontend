import React from 'react';
import { useGetDriverCabQuery } from '../redux/api/cabApi';
import { Link, useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import{Button} from '@chakra-ui/react'
import { MdArrowForward } from "react-icons/md";



const CabCard = ({ cab }) => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/myRide/${cab._id}`);
  };

  return (
    <div className="cab-card">
      <Carousel images={cab.photos} />
      <div className="cab-info">
        <h2>{cab.modelName}</h2>
        <p><span>Availability:</span> {cab.availability}</p>
        <p><span>Capacity:</span> {cab.capacity} persons</p>
        <p><span>Feature:</span> {cab.feature}</p>
        <p><span>Status:</span> {cab.isReady ? 'Ready' : 'Not Ready'}</p>
        <p><span>Created:</span> {new Date(cab.createdAt).toLocaleDateString()}</p>
        <Button colorScheme='pink' rightIcon={<MdArrowForward />} onClick={handleSubmit}>Details</Button>
      </div>
    </div>
  );
};




const MyRide = () => {
  const { data: cabsData, isLoading } = useGetDriverCabQuery();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  const cabs = cabsData?.driverCabs || [];

  return (
    <div className="my-ride">
      {cabs.length > 0 ? (
        <div className="cab-list">
          {cabs.map(cab => (
            <CabCard key={cab._id} cab={cab} />
          ))}
        </div>
      ) : (
        <p className="no-cabs">No cabs available at the moment.</p>
      )}
    </div>
  );
};

export default MyRide;