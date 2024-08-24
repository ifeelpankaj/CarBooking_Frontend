import React, { useState } from 'react'
import AdminSidebar from './AdminComponent/AdminSidebar'
import { useCabDetailQuery, useUpdateCabMutation } from '../redux/api/cabApi';
import { useParams } from 'react-router-dom';
import { useAdminDriverDetailsQuery, useSetRateForCabMutation } from '../redux/api/adminApi';
import { CarDetails, DriverInfo } from '../AllComponent/Component';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const ManageCabs = () => {
    const { id } = useParams();
    const [rate, setRate] = useState();
    const { data: cabData, isLoading: cabLoading } = useCabDetailQuery(id, {
        refetchOnMountOrArgChange: true
    });

    // console.log(cabData.cab)
    const { data: driverDetail, isLoading ,refetch} = useAdminDriverDetailsQuery(cabData?.cab?.belongsTo, {
        skip: !cabData?.cab?.belongsTo,
        refetchOnMountOrArgChange: true,
    });
    const [setRateForCab, { isLoading: isSettingRate }] = useSetRateForCabMutation();

    if (cabLoading || isLoading || !cabData || !driverDetail) return <Loader />;

    const { driver: Driver, driver: { cab: DriversCab } } = driverDetail;

    const handleSetRate = async () => {
        try {
            const result = await setRateForCab({ id, rate: parseFloat(rate) }).unwrap();
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message)
            }
            setRate('');
            refetch();
        } catch (error) {

            toast.error(error.data.message)
        }
    }


    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="admin_manage_cabs">
                <section className="admin_manage_cabs-section">
                    <h1>Cab Details</h1>
                    <div className="admin_manage_cabs-section-driver-cab-info">
                        <DriverInfo driver={Driver} CabId={DriversCab.cabId}  cab={DriversCab}/>
                        <CarDetails cab={DriversCab} />
                    </div>

                    <div className="admin_manage_cabs-section-set-cab-rate">
                        <h2>Set Cab Rate</h2>
                        <input
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            placeholder="Enter new rate"
                            
                        />
                        <button onClick={handleSetRate} disabled={isSettingRate}>
                            {isSettingRate ? 'Setting Rate...' : 'Set Rate'}
                        </button>
                    </div>
                </section>

            </main>
        </div>
    )
}

export default ManageCabs