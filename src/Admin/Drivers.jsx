import React from 'react'
import { useAdminDriverQuery } from '../redux/api/adminApi';
import AdminSidebar from './AdminComponent/AdminSidebar';
import CustomTable from './AdminComponent/TableHOC';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

const Drivers = () => {
  const { data: adminDrivers, isLoading: driverLoading } = useAdminDriverQuery({refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,});
  const navigate = useNavigate();

  const columns = [
    { key: 'username', title: 'Name' },
    { key: 'phoneNumber', title: 'Mobile No' },
    { key: 'isDocumentSubmited', title: 'Document' },
    { key: 'haveCab', title: 'Car' },
    { key: 'manage', title: 'Manage' },
  ];

  const filterableColumns = ['username', 'phoneNumber', 'haveCab','isDocumentSubmited'];
  
  const formatData = (data) => {
    if (!data || !data.data) return [];

    return data.data.map(driver => ({
      username: driver.username || 'N/A',
      phoneNumber: driver.phoneNumber || 'N/A',
      isDocumentSubmited: driver.isDocumentSubmited ? 'Yes' : 'No',
      haveCab: driver.haveCab ? 'Yes' : 'No',


      manage: <button onClick={() => handleManage(driver._id)}>Manage</button>
    }));
  };

  if (driverLoading) {
    return <Loader/>;
  }

  const formattedData = formatData(adminDrivers);

  const handleManage = (id) => {
    navigate(`/admin/manage-driver/${id}`)
  };
  return (
    <div className="admin-container">
    <AdminSidebar />
    <main>
      <CustomTable
        data={formattedData}
        columns={columns}
        itemsPerPage={5}
        filterableColumns={filterableColumns}
      />
    </main>
  </div>
  )
}

export default Drivers