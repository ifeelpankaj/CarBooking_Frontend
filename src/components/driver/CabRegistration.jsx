
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
    cabNumber:'',
    feature: 'AC',
    frontPhoto: null,
    additionalPhotos: [],
    // photos: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCabData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setCabData(prev => ({ ...prev, photos: files }));
  };
  const handleFrontPhotoChange = (e) => {
    const file = e.target.files[0];
    setCabData((prev) => ({ ...prev, frontPhoto: file }));
  };

  const handleAdditionalPhotosChange = (e) => {
    const files = Array.from(e.target.files);
    setCabData((prev) => ({ ...prev, additionalPhotos: files }));
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   Object.keys(cabData).forEach(key => {
  //     if (key === 'photos') {
  //       cabData[key].forEach(photo => formData.append('photos', photo));
  //     } else {
  //       formData.append(key, cabData[key]);
  //     }
  //   });

  //   try {
  //     const result = await cabRegister(formData).unwrap();
  //     if(result.success){
  //       toast.success(result.message);
  //       onSubmitSuccess(); 
  //     } else {
  //       toast.error(result.message);
  //     }
  //   } catch (error) {
  //     console.error('Failed to register cab:', error);
  //     toast.error('Failed to register cab. Please try again.');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append other data
    Object.keys(cabData).forEach((key) => {
      if (key !== 'frontPhoto' && key !== 'additionalPhotos') {
        formData.append(key, cabData[key]);
      }
    });

    // Append photos with front photo at the first position
    if (cabData.frontPhoto) {
      formData.append('photos', cabData.frontPhoto);
    }
    cabData.additionalPhotos.forEach((photo) => formData.append('photos', photo));

    try {
      const result = await cabRegister(formData).unwrap();
      if (result.success) {
        toast.success(result.message);
        onSubmitSuccess();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      if(error.data.message === "Validation Error"){
        return toast.error("Kindly fill all the Info required");
      }
      
    }
  };
  return (
    // <motion.div
    //   className="cab-registration"
    //   initial={{ opacity: 0, y: 20 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   transition={{ duration: 0.5 }}
    // >
    //   <form onSubmit={handleSubmit}>
    //     {Object.entries(cabData).map(([key, value], index) => (
    //       <motion.div
    //         key={key}
    //         className="form-group"
    //         initial={{ opacity: 0, x: -20 }}
    //         animate={{ opacity: 1, x: 0 }}
    //         transition={{ duration: 0.5, delay: index * 0.1 }}
    //       >
    //         <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
    //         {key === 'photos' ? (
    //           <input
    //             type="file"
    //             id={key}
    //             name={key}
    //             onChange={handleFileChange}
    //             multiple
    //           />
    //         ) : key === 'feature' ? (
    //           <select
    //             id={key}
    //             name={key}
    //             value={value}
    //             onChange={handleInputChange}
    //           >
    //             <option value="AC">AC</option>
    //             <option value="NON/AC">NON/AC</option>
    //           </select>
    //         ) : (
    //           <input
    //             type={key === 'capacity' ? 'number' : 'text'}
    //             id={key}
    //             name={key}
    //             value={value}
    //             onChange={handleInputChange}
    //             required
    //           />
    //         )}
    //       </motion.div>
    //     ))}
    //     <motion.button
    //       type="submit"
    //       disabled={isLoading}
    //       whileHover={{ scale: 1.05 }}
    //       whileTap={{ scale: 0.95 }}
    //     >
    //       {isLoading ? 'Registering...' : 'Register Cab'}
    //     </motion.button>
    //   </form>
    // </motion.div>
    <motion.div
      className="drivercab_cab-registration"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit}>
        {Object.entries(cabData).map(([key, value], index) => (
          key !== 'frontPhoto' && key !== 'additionalPhotos' && (
            <motion.div
              key={key}
              className="drivercab_form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              {key === 'feature' ? (
                <select id={key} name={key} value={value} onChange={handleInputChange}>
                  <option value="AC">AC</option>
                  <option value="NON/AC">NON/AC</option>
                </select>
              ) : key === 'capacity' ? (
                <select id={key} name={key} value={value} onChange={handleInputChange} required>
                  <option value="">Select Capacity</option>
                  <option value="4">4 Seater</option>
                  <option value="5">5 Seater</option>
                  <option value="6">6 Seater</option>
                  <option value="7">7 Seater</option>
                </select>
              ) : (
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  required
                />
              )}
            </motion.div>
          )
        ))}

        <motion.div
          className="drivercab_form-group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: Object.keys(cabData).length * 0.1 }}
        >
          <label htmlFor="frontPhoto">Front Photo</label>
          <input
            type="file"
            id="frontPhoto"
            name="frontPhoto"
            onChange={handleFrontPhotoChange}
            required
          />
        </motion.div>

        <motion.div
          className="form-group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: (Object.keys(cabData).length + 1) * 0.1 }}
        >
          <label htmlFor="additionalPhotos">Additional Photos</label>
          <input
            type="file"
            id="additionalPhotos"
            name="additionalPhotos"
            onChange={handleAdditionalPhotosChange}
            multiple
          />
        </motion.div>

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



