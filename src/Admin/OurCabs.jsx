import React from 'react';
import { useAdminCabsQuery } from '../redux/api/adminApi';
import CustomTable from './AdminComponent/TableHOC';
import AdminSidebar from './AdminComponent/AdminSidebar';
import Loader from '../components/Loader';
const OurCabs = () => {
  const { data: adminCabs, isLoading: cabsLoading } = useAdminCabsQuery();
  // console.log(adminCabs)
  const columns = [
    { key: 'avalibility', title: 'Availability' },
    { key: 'belongsTo', title: 'Belongs To' },
    { key: 'capacity', title: 'Capacity' },
    { key: 'registeredAt', title: 'Registered At' },
    { key: 'isReady', title: 'Is Ready' },
    { key: 'modelName', title: 'Model Name' },
    // { key: 'manage', title: 'Manage' },
  ];

  const filterableColumns = ['availability', 'modelName', 'isReady'];

  const formatData = (data) => {
    if (!data || !data.data) return [];

    return data.data.map(cab => ({
      avalibility: cab.availability || 'N/A',
      belongsTo: cab.belongsTo || 'N/A',
      capacity: cab.capacity?.toString() || 'N/A',
      registeredAt: new Date(cab.createdAt).toLocaleDateString(),
      isReady: cab.isReady ? 'Yes' : 'No',
      modelName: cab.modelName || 'N/A',
      // manage: <button onClick={() => handleManage(cab._id)}>Manage</button>
    }));
  };

  const handleManage = (id) => {
    console.log(`Manage cab with id: ${id}`);
  };

  if (cabsLoading) {
    return <Loader/>;
  }

  const formattedData = formatData(adminCabs);

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

  );
};

export default OurCabs;