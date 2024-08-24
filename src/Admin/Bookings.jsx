import React, { useEffect } from 'react'
import AdminSidebar from './AdminComponent/AdminSidebar'
import CustomTable from './AdminComponent/TableHOC'
import { useAdminBookingsQuery } from '../redux/api/adminApi';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
  const navigate = useNavigate();
  const {
    data: adminBookings,
    isLoading: bookingLoading,
    refetch: refetchOrder
  } = useAdminBookingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    providesTags: ['orders']
  });
  useEffect(() => {
    refetchOrder();
  }, [refetchOrder]);
  console.log(adminBookings)
  const columns = [
    { key: 'id', title: 'Ref No.' },
    { key: 'pickupLocation', title: 'From' },
    { key: 'destination', title: 'To' },
    { key: 'bookingStatus', title: 'Booking Status' },
    { key: 'bookingAmount', title: 'Fair' },
    { key: 'departureDate', title: 'Departure' },
    { key: 'paymentMethod', title: 'Pay Method' },

    { key: 'manage', title: 'Manage' },
  ];
  const formatData = (data) => {
    if (!data || !data.data) return [];

    const getFirstWord = (str) => {
      if (!str) return 'N/A';
      return str.split(' ')[0];
    };
    return data.data.map(booking => ({
      avalibility: booking.avalibility || 'N/A',
      pickupLocation: getFirstWord(booking.pickupLocation) || 'N/A',
      destination: getFirstWord(booking.destination) || 'N/A',
      bookingStatus: booking.bookingStatus || 'N/A',
      paymentMethod: booking.paymentMethod || 'N/A',
      bookingAmount: Math.round(booking.bookingAmount) || 'N/A',
      // bookedCab: booking.bookedCab || 'N/A',
      id: booking._id || 'N/A',
      departureDate: new Date(booking.departureDate).toLocaleDateString(),

      manage: <button onClick={() => handleManage(booking._id)}>Manage</button>
    }));
  };
  const filterableColumns = ['pickupLocation', 'destination', 'departureDate', 'paymentMethod', 'bookingStatus','id'];
  const handleManage = (id) => {
    // console.log(`Manage cab with id: ${id}`);
    navigate(`/admin/manage-booking/${id}`)
  };

  if (bookingLoading) {
    return <Loader />;
  }

  const formattedData = formatData(adminBookings);
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

export default Bookings