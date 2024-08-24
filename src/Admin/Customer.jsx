import React from 'react'
import AdminSidebar from './AdminComponent/AdminSidebar'
import { useAdminUsersQuery } from '../redux/api/adminApi';
import CustomTable from './AdminComponent/TableHOC';

const Customer = () => {

  const { data: adminUser, isLoading: usersLoading } = useAdminUsersQuery({refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,});
  const columns = [
    { key: 'username', title: 'Name' },
    { key: 'id', title: 'Ref No.' },
    { key: 'phoneNumber', title: 'Mobile No.' },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role' },
    { key: 'registeredAt', title: 'Registered At' },
    { key: 'manage', title: 'Manage' },

  
  ];
  const filterableColumns = ['username', 'phoneNumber', 'email','role','id'];

  const formatData = (data) => {
    if (!data || !data.data) return []

    return data.data.map(user => ({
      username: user.username || 'N/A',
      id:user._id || 'N/A',
      phoneNumber: user.phoneNumber || 'N/A',
      email: user.email || 'N/A',
      role:user.role|| 'N/A',
      registeredAt: new Date(user.createdAt).toLocaleDateString(),
      manage: <button onClick={() => handleManage(cab._id)}>Manage</button>
    }));
  };

  if (usersLoading) {
    return <div>Loading...</div>;
  }
  const formattedData = formatData(adminUser);
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

export default Customer