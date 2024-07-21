import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCabDetailQuery, useUpdateCabMutation } from '../redux/api/cabApi';


const MyRideDetails = () => {
  const { id } = useParams();
  const { data: cabData, isLoading } = useCabDetailQuery(id);
  const [updateCab, { isLoading: isUpdating }] = useUpdateCabMutation();

  const [formData, setFormData] = useState({
    modelName: '',
    feature: '',
    capacity: '',
    photos: []
  });

  React.useEffect(() => {
    if (cabData && cabData.cab) {
      setFormData({
        modelName: cabData.cab.modelName,
        feature: cabData.cab.feature,
        capacity: cabData.cab.capacity,
        photos: cabData.cab.photos
      });
    }
  }, [cabData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photos: Array.from(e.target.files)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('modelName', formData.modelName);
    formDataToSend.append('feature', formData.feature);
    formDataToSend.append('capacity', formData.capacity);
    formData.photos.forEach((photo, index) => {
      formDataToSend.append('photos', photo);
    });

    try {
      await updateCab({ id, newData: formDataToSend }).unwrap();
      alert('Cab updated successfully!');
    } catch (error) {
      alert('Failed to update cab. Please try again.');
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="my-ride-details">
      <h1>Edit Cab Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="modelName">Model Name:</label>
          <input
            type="text"
            id="modelName"
            name="modelName"
            value={formData.modelName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="feature">Feature:</label>
          <input
            type="text"
            id="feature"
            name="feature"
            value={formData.feature}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacity:</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="photos">Photos:</label>
          <input
            type="file"
            id="photos"
            name="photos"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Cab'}
        </button>
      </form>
      <div className="current-details">
        <h2>Current Details:</h2>
        <p><strong>Model Name:</strong> {cabData.cab.modelName}</p>
        <p><strong>Feature:</strong> {cabData.cab.feature}</p>
        <p><strong>Capacity:</strong> {cabData.cab.capacity}</p>
        <p><strong>Is Ready:</strong> {cabData.cab.isReady ? 'Yes' : 'No'}</p>
        <p><strong>Type:</strong> {cabData.cab.type}</p>
        <div className="photos">
          <h3>Current Photos:</h3>
          {cabData.cab.photos.map((photo, index) => (
            <img key={index} src={photo.url} alt={`Cab view ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyRideDetails;