import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const server = import.meta.env.VITE_SERVER

export const adminApi = createApi({
    reducerPath: 'adminSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/admin/`,
        credentials: 'include',
    }),
    tagTypes: ['users'],
    endpoints: (builder) => ({
        //cabs
        adminCabs: builder.query({
            query: () => 'all-cabs',
            providesTags: ['cabs'],
        }),
        adminUsers: builder.query({
            query: () => 'all-users',
            providesTags: ['users'],
        }),
        // adminBookings: builder.query({
        //     query: () => 'all-bookings',
        //     providesTags: ['orders', 'cabs'],
        // }),
        adminBookings: builder.query({
            query: (params) => ({
                url: 'all-bookings',
                params: params,
            }),
            providesTags: ['orders'],
        }),
        bookingStats: builder.query({
            query: () => 'booking-stats',
            providesTags: ['orders'],
        }),
        adminDriver: builder.query({
            query: () => 'all-drivers',
            providesTags: ['users'],
        }),


        adminAvaliableCab: builder.mutation({
            query: (payload) => ({
                url: 'admin-avaliable-cab',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['cabs'],
        }),

        adminAssignCab: builder.mutation({
            query: ({ orderId, newCabId, departureDate, dropOffDate, driverCut }) => ({
                url: `assign-cab/${orderId}`,
                method: 'PATCH',
                body: { newCabId, departureDate, dropOffDate, driverCut }
            }),
            invalidatesTags: ['orders', 'cabs']
        }),

        adminDriverDetails: builder.query({
            query: (Id) => `admin-driver-ById/${Id}`,
            providesTags: ['cabs', 'users', 'orders'],
        }),
        setRateForCab: builder.mutation({
            query: ({ id, rate }) => ({
              url: `/setRate/${id}`,
              method: 'POST',
              body: { rate },
            }),
            invalidatesTags: ['Cab'],
          }),
        adminVerifyDriver: builder.mutation({
            query: ({ id, flag }) => ({
                url: `admin-verify-driver/${id}`,
                method: 'PUT',
                body: { flag }, // Include the flag in the request body
            }),
            invalidatesTags: ['user'],
        }),

    })

})

export const { useAdminCabsQuery, useAdminUsersQuery, useAdminBookingsQuery, useAdminDriverQuery, useAdminAvaliableCabMutation, useAdminAssignCabMutation, useAdminDriverDetailsQuery, useAdminVerifyDriverMutation,useBookingStatsQuery ,useSetRateForCabMutation} = adminApi;