
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCabRegisterMutation } from '../../redux/api/cabApi';
import toast from 'react-hot-toast';
import {motion} from 'framer-motion'

const CabRegistration = ({ onSubmitSuccess }) => {

  const [cabRegister, { isLoading }] = useCabRegisterMutation();

  const [cabData, setCabData] = useState({
    modelName: '',
    type: '',
    capacity: '',
    feature: 'AC',
    photos: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCabData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setCabData(prev => ({ ...prev, photos: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(cabData).forEach(key => {
      if (key === 'photos') {
        cabData[key].forEach(photo => formData.append('photos', photo));
      } else {
        formData.append(key, cabData[key]);
      }
    });

    try {
      const result = await cabRegister(formData).unwrap();
      if(result.success){
        toast.success(result.message);
        onSubmitSuccess(); 
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Failed to register cab:', error);
      toast.error('Failed to register cab. Please try again.');
    }
  };

  return (
    <motion.div
      className="cab-registration"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Register Your Cab</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(cabData).map(([key, value], index) => (
          <motion.div
            key={key}
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            {key === 'photos' ? (
              <input
                type="file"
                id={key}
                name={key}
                onChange={handleFileChange}
                multiple
              />
            ) : key === 'feature' ? (
              <select
                id={key}
                name={key}
                value={value}
                onChange={handleInputChange}
              >
                <option value="AC">AC</option>
                <option value="NON/AC">NON/AC</option>
              </select>
            ) : (
              <input
                type={key === 'capacity' ? 'number' : 'text'}
                id={key}
                name={key}
                value={value}
                onChange={handleInputChange}
                required
              />
            )}
          </motion.div>
        ))}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? 'Registering...' : 'Register Cab'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CabRegistration;



