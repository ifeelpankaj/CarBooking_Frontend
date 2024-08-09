// DocumentVerification.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useDocVerificationMutation } from '../../redux/api/driverApi';
import { motion, AnimatePresence } from 'framer-motion';


const DocumentVerification = ({ onSubmitSuccess }) => {
  const { user } = useSelector((state) => state.auth);
  const driver = user ? user.name : "user";
  const [docVerification, { isLoading }] = useDocVerificationMutation();

  const [documents, setDocuments] = useState({
    aadharCard: null,
    panCard: null,
    drivingLicense: null,
    insurance: null,
    puc: null
  });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  const [showDocument, setShowDocument] = useState(null);

  const handleFileChange = (event, docType) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/')) && file.size <= 2 * 1024 * 1024) {
      setDocuments({ ...documents, [docType]: file });
    } else {
      toast.error('Invalid file. Please upload a PDF or image file under 2MB.');
    }
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
      toast.error(error.data.message);
    }
  };

  const toggleShowDocument = (docType) => {
    setShowDocument(showDocument === docType ? null : docType);
  };
  const renderFilePreview = (file, docType) => {
    if (file.type === 'application/pdf') {
      if (isMobile) {
        return (
          <div className="pdf-preview">
            <p>PDF file: {file.name}</p>
            <a 
              href={URL.createObjectURL(file)} 
              download={file.name}
              className="download-btn"
            >
              Download PDF
            </a>
          </div>
        );
      } else {
        return (
          <embed 
            src={URL.createObjectURL(file)} 
            type="application/pdf" 
            width="100%" 
            height="400px" 
          />
        );
      }
    } else if (file.type.startsWith('image/')) {
      return <img src={URL.createObjectURL(file)} alt={`${docType} preview`} />;
    } else {
      return <p>Unsupported file type</p>;
    }
  };

  return (
    <motion.div
      className="driver_document-verification"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit}>
        {Object.entries(documents).map(([docType, file]) => (
          <div key={docType} className="driver_document-item">
            <label htmlFor={docType}>
              {docType.charAt(0).toUpperCase() + docType.slice(1).replace(/([A-Z])/g, ' $1')}:
            </label>
            <div className="driver_file-input-wrapper">
              <input
                type="file"
                id={docType}
                onChange={(e) => handleFileChange(e, docType)}
                accept=".pdf,image/*"
                required
              />
              
              {file && (
                <button
                  type="button"
                  className="driver_show-document-btn"
                  onClick={() => toggleShowDocument(docType)}
                >
                  {showDocument === docType ? 'Hide' : 'Show'}
                </button>
              )}
            </div>
            <AnimatePresence>
              {showDocument === docType && (
                <motion.div
                  className="driver_document-preview"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderFilePreview(file, docType)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <p className="driver_file-requirements">Allowed file types: PDF and images. Maximum file size: 2MB</p>
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? 'Submitting...' : 'Submit Documents'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default DocumentVerification;