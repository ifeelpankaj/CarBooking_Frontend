import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminDriverDetailsQuery, useAdminVerifyDriverMutation } from '../redux/api/adminApi';
import Loader from '../components/Loader';
import AdminSidebar from './AdminComponent/AdminSidebar';
import toast from 'react-hot-toast';
import { BookingSection, CarDetails, Documents, DriverInfo } from '../AllComponent/Component';
import { DateUtils } from '../utils/DateUtils';

const DocName = ['Aadhar Card', 'Pan Card', 'License', 'Insurance', 'PUC'];

const ManageDrivers = () => {
    const { id } = useParams();
    const { data: driverDetail, isLoading } = useAdminDriverDetailsQuery(id);
    const [adminVerifyDriver, { isLoading: verifyLoading, error: verifyError }] = useAdminVerifyDriverMutation();
    const [showDocument, setShowDocument] = useState(null);
    const [isVerified, setIsVerified] = useState(driverDetail?.driver?.isDocumentSubmited);

    if (isLoading || !driverDetail) return <Loader />;

    const { driver: Driver, driver: { cab: DriversCab } } = driverDetail;
   

    const toggleShowDocument = (docId) => setShowDocument(prev => prev === docId ? null : docId);

    const handleVerify = async () => {
        try {
            const res = await adminVerifyDriver({ id, flag: !isVerified }).unwrap();
    
            if (res.success) {
                toast.success(res.message)
            }
            setIsVerified(prev => !prev);
        } catch (error) {
            console.error("Error verifying driver:", error);
            toast.error(error.data.message)
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        const bookingsContainer = document.querySelector('.admin_driver_bookings');
        const scrollAmount = bookingsContainer.offsetWidth / 2;

        document.querySelector('.admin_driver_bookings::before').addEventListener('click', () => {
            bookingsContainer.scrollBy(-scrollAmount, 0);
        });

        document.querySelector('.admin_driver_bookings::after').addEventListener('click', () => {
            bookingsContainer.scrollBy(scrollAmount, 0);
        });
    });
    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="admin_driver_manage-drivers">
                <section className="admin_driver_driver-details">
                    <h1>Driver Details</h1>
                    <div className="driver-car-info">
                        <DriverInfo driver={Driver} CabId={DriversCab.cabId} />
                        <CarDetails cab={DriversCab} />
                    </div>
                    <div className="documents-section">
                        <Documents
                            documents={Driver.driverDocuments}
                            showDocument={showDocument}
                            toggleShowDocument={toggleShowDocument}
                            DocName={DocName}
                        />
                    </div>
                    <div className="verify-button-section">
                        <VerifyButton
                            isVerified={isVerified}
                            handleVerify={handleVerify}
                            isLoading={verifyLoading}
                            error={verifyError}
                        />
                    </div>
                    <div className="booking-section">
                        <BookingSection cab={DriversCab} formatDate={DateUtils.formatShortDate} />
                    </div>
                </section>
            </main>
        </div>
    );
};


const VerifyButton = ({ isVerified, handleVerify, isLoading, error }) => (
    <div className="admin_driver_verify-section">
        <AnimatePresence mode="wait">
            <motion.button
                key={isVerified ? 'resubmit-button' : 'verify-button'}
                onClick={handleVerify}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : isVerified ? 'Resubmit' : 'Verify'}
            </motion.button>
        </AnimatePresence>
    </div>
);




export default ManageDrivers;