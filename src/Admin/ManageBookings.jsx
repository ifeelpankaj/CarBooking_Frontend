import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminComponent/AdminSidebar';
import { useParams } from 'react-router-dom';
import { useOrderDetailQuery } from '../redux/api/orderApi';
import { useCabDetailQuery } from '../redux/api/cabApi';
import Loader from '../components/Loader';
import { useAdminAvaliableCabMutation, useAdminAssignCabMutation, adminApi, useAdminDriverDetailsQuery } from '../redux/api/adminApi';
import CustomTable from './AdminComponent/TableHOC';
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux';
import { DriverCard, JourneySection, PassengersSection, PaymentSection } from '../AllComponent/Component';



const ManageBookings = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [requestDate, setRequestDate] = useState('');
    const [manualCabId, setManualCabId] = useState('');
    const [driverCut, setDriverCut] = useState('');

    const [availableCabs, setAvailableCabs] = useState([]);

    const { data: adminOrder, isLoading: orderLoading, refetch: refetchOrder } = useOrderDetailQuery(id);
    const { data: cabData, isLoading: cabLoading } = useCabDetailQuery(adminOrder?.order?.bookedCab, {
        skip: !adminOrder?.order?.bookedCab,
        refetchOnMountOrArgChange: true
    });
    const { data: driverInfo, isLoading: driverLoading } = useAdminDriverDetailsQuery(adminOrder?.order?.driverId, {
        skip: !adminOrder?.order?.driverId
    });

    const [adminAvaliableCab] = useAdminAvaliableCabMutation();
    const [adminAssignCab] = useAdminAssignCabMutation();

    if (orderLoading || cabLoading || !adminOrder || !cabData) return <Loader />;
    if (!adminOrder?.order) return <div className="error">Error loading order details</div>;

    const { order } = adminOrder;
    const driver = driverInfo?.driver;

    const fetchAvailableCabs = async () => {
        if (cabData?.cab?.capacity && requestDate) {
            try {
                if(!driverCut) return toast.error("Enter amount which you will give to driver");
                const result = await adminAvaliableCab({ capacity: cabData.cab.capacity, date: requestDate }).unwrap();
                setAvailableCabs(result.data);
            } catch (error) {
                toast.error(error.data?.message || 'Failed to fetch available cabs');
            }
        }
    };

    const handleAssignCab = async (newCabId) => {
        try {

            const result = await adminAssignCab({
                orderId: id,
                newCabId,
                departureDate: requestDate,
                dropOffDate: order.dropOffDate || order.departureDate,
                driverCut: driverCut  // Changed from driveCut to driverCut
            }).unwrap();
            toast.success(result.message);
            refetchOrder();
            dispatch(adminApi.util.invalidateTags(['orders']));
            setAvailableCabs([]);
        } catch (error) {
            toast.error(error.data?.message || 'Failed to assign cab');
        }
    };

    const tableColumns = [
        { key: 'modelName', title: 'Model Name' },
        { key: 'capacity', title: 'Capacity' },
        { key: 'driverName', title: 'Driver Name' },
        { key: 'driverEmail', title: 'Driver Email' },
        { key: 'driverPhone', title: 'Driver Phone' },
        { key: 'assign', title: 'Assign', action: (cabId) => handleAssignCab(cabId) },
    ];

    const tableData = availableCabs.map(cab => ({
        ...cab,
        driverName: cab.driver.name,
        driverEmail: cab.driver.email,
        driverPhone: cab.driver.phoneNumber,
        assign: <button onClick={() => handleAssignCab(cab.cabId)}>Assign</button>
    }));

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="admin_booking_booking-page">
                <div className="booking_booking-detail">
                    <h1 className="booking_booking-detail__title">Journey Details</h1>
                    <JourneySection order={order} />
                    <PassengersSection passengers={order.passengers} />
                    <PaymentSection order={order} />
                </div>
                
                {order.driverId ? (
                    <DriverCard driver={driver} />
                ) : (
                    <AvailableCabsSection 
                        requestDate={requestDate}
                        setRequestDate={setRequestDate}
                        fetchAvailableCabs={fetchAvailableCabs}
                        availableCabs={availableCabs}
                        tableData={tableData}
                        tableColumns={tableColumns}
                        manualCabId={manualCabId}
                        setManualCabId={setManualCabId}
                        handleAssignCab={handleAssignCab}
                        driverCut = {driverCut}
                        setDriverCut = {setDriverCut}
                    />
                )}
            </main>
        </div>
    );
};
const AvailableCabsSection = ({ 
    requestDate, setRequestDate, fetchAvailableCabs, availableCabs, 
    tableData, tableColumns, manualCabId, setManualCabId, handleAssignCab ,driverCut,setDriverCut
}) => (
    <div className="admin_booking_cabs-container">
        <h2 className="admin_booking_cabs-title">Available Cabs</h2>
        <input
            type="date"
            value={requestDate}
            onChange={(e) => setRequestDate(e.target.value)}
            required
        />
        <input
            type="Number"
            value={driverCut}
            onChange={(e) => setDriverCut(e.target.value)}
            required
        />
        <button onClick={fetchAvailableCabs} className="admin_booking_fetch-cabs-btn">
            Fetch Available Cabs
        </button>
        {availableCabs.length > 0 ? (
            <div className="admin_booking_cabs-table-wrapper">
                <CustomTable
                    data={tableData}
                    columns={tableColumns}
                    itemsPerPage={10}
                    filterableColumns={['modelName', 'capacity', 'driverName']}
                />
            </div>
        ) : (
            <div className="admin_booking_manual-assign">
                <input
                    type="text"
                    value={manualCabId}
                    onChange={(e) => setManualCabId(e.target.value)}
                    placeholder="Enter Cab ID"
                />
                <button onClick={() => handleAssignCab(manualCabId)}>Assign Manually</button>
            </div>
        )}
    </div>
);

export default ManageBookings;