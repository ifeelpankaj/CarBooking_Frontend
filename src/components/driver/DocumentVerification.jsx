import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useDocVerificationMutation } from '../../redux/api/driverApi';

const DocumentVerification = ({ onSubmitSuccess }) => {
  const { user } = useSelector((state) => state.auth);
  let driver;
    if(user){
       driver = user.name
    }else{
      driver = "user"
    }
  const [docVerification, { isLoading }] = useDocVerificationMutation();

  const [documents, setDocuments] = useState({
    aadharCard: null,
    panCard: null,
    drivingLicense: null,
    insurance: null,
    puc: null
  });

  const handleFileChange = (event, docType) => {
    setDocuments({ ...documents, [docType]: event.target.files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    Object.entries(documents).forEach(([docType, file]) => {
      if (file) {
        formData.append('document', file);
        const formattedDocName = `${user.username}_${docType.charAt(0).toUpperCase() + docType.slice(1)}`;
        formData.append('docName[]', formattedDocName);
      }
    });

    try {
      const result = await docVerification(formData).unwrap();
      toast.success(result.message);
      onSubmitSuccess(); 
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="document-verification">
      <h1>Driver Document Submission</h1>
      <form onSubmit={handleSubmit}>
      {Object.entries(documents).map(([docType, file]) => (
            <div key={docType} className="document-input">
              <label htmlFor={docType}>
                {docType.charAt(0).toUpperCase() + docType.slice(1).replace(/([A-Z])/g, ' $1')}:
              </label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id={docType}
                  onChange={(e) => handleFileChange(e, docType)}
                  required
                />
                <span className="file-name">
                  {file ? `${driver}_${docType.charAt(0).toUpperCase() + docType.slice(1)}` : 'No file chosen'}
                </span>
              </div>
            </div>
          ))}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Documents'}
        </button>
      </form>
    </div>
  );
};

export default DocumentVerification;