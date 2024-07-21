// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useCabRegisterMutation } from '../../redux/api/cabApi';
// import toast from 'react-hot-toast';



// const CabRegistration = () => {
//   const { user } = useSelector((state) => state.auth);
//   const [cabRegister, { isLoading }] = useCabRegisterMutation();

//   const [cabData, setCabData] = useState({
//     modelName: '',
//     type: '',
//     capacity: '',
//     feature: 'AC',
//     photos: [],
//     rate: ''
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCabData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setCabData(prev => ({ ...prev, photos: files }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.keys(cabData).forEach(key => {
//       if (key === 'photos') {
//         cabData[key].forEach(photo => formData.append('photos', photo));
//       } else {
//         formData.append(key, cabData[key]);
//       }
//     });

//     try {
//       const result  = await cabRegister(formData).unwrap();
//       if(result.success){
//         toast.success(result.message);
//       }else{
//         toast.error(result.message);
//       }
      
//       // Reset form or redirect
//     } catch (error) {
//       console.error('Failed to register cab:', error);
//       toast.error('Failed to register cab. Please try again.');
//     }
//   };

//   return (
//     <div className="cab-registration">
//       <h2>Register Your Cab</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="modelName">Model Name</label>
//           <input
//             type="text"
//             id="modelName"
//             name="modelName"
//             value={cabData.modelName}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="type">Type</label>
//           <input
//             type="text"
//             id="type"
//             name="type"
//             value={cabData.type}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="capacity">Capacity</label>
//           <input
//             type="number"
//             id="capacity"
//             name="capacity"
//             value={cabData.capacity}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="feature">Feature</label>
//           <select
//             id="feature"
//             name="feature"
//             value={cabData.feature}
//             onChange={handleInputChange}
//           >
//             <option value="AC">AC</option>
//             <option value="NON/AC">NON/AC</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label htmlFor="photos">Photos</label>
//           <input
//             type="file"
//             id="photos"
//             name="photos"
//             onChange={handleFileChange}
//             multiple
//           />
//         </div>

//         <button type="submit" disabled={isLoading}>
//           {isLoading ? 'Registering...' : 'Register Cab'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CabRegistration;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCabRegisterMutation } from '../../redux/api/cabApi';
import toast from 'react-hot-toast';

const CabRegistration = ({ onSubmitSuccess }) => {
  const { user } = useSelector((state) => state.auth);
  const [cabRegister, { isLoading }] = useCabRegisterMutation();

  const [cabData, setCabData] = useState({
    modelName: '',
    type: '',
    capacity: '',
    feature: 'AC',
    photos: [],
    rate: ''
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
        onSubmitSuccess(); // Call this function to refetch DriverHome data
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Failed to register cab:', error);
      toast.error('Failed to register cab. Please try again.');
    }
  };

  return (
    <div className="cab-registration">
      <h2>Register Your Cab</h2>
      <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="modelName">Model Name</label>
            <input
              type="text"
              id="modelName"
              name="modelName"
              value={cabData.modelName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Vehicle Reg. Number</label>
            <input
              type="text"
              id="type"
              name="type"
              value={cabData.cabNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={cabData.type}
              onChange={handleInputChange}
            />
          </div>

  
          <div className="form-group">
            <label htmlFor="capacity">Capacity</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={cabData.capacity}
              onChange={handleInputChange}
              required
            />
          </div>
  
          <div className="form-group">
            <label htmlFor="feature">Feature</label>
            <select
              id="feature"
              name="feature"
              value={cabData.feature}
              onChange={handleInputChange}
            >
              <option value="AC">AC</option>
              <option value="NON/AC">NON/AC</option>
            </select>
          </div>
  
          <div className="form-group">
            <label htmlFor="photos">Photos</label>
            <input
              type="file"
              id="photos"
              name="photos"
              onChange={handleFileChange}
              multiple
            />
          </div>
  
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register Cab'}
          </button>
        </form>
    </div>
  );
};

export default CabRegistration;



