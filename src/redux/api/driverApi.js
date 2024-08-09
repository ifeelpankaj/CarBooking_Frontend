import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { transform } from "framer-motion";

const server = import.meta.env.VITE_SERVER

export const driverApi = createApi({
    reducerPath: 'driverSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/driver/`,
        credentials: 'include',
    }),
    tagTypes: ['users'],
    endpoints: (builder) => ({
        docVerification: builder.mutation({
            query: (doc) => ({
                url: "docverify",
                method: "PUT",
                body: doc,
            }),
            invalidatesTags: ['users'],
        }),
        driverBooking: builder.query({
            query: () => 'getDriverBooking',
            providesTags: ['orders']
        }),
        confirmBooking: builder.mutation({
            query: ({orderId}) => ({ 
            url: 'confirm-driver-booking',
            method:'PUT',
            body:{orderId},
        }),
        invalidatesTags: ['users','cabs','orders'],
        }),
        cancelBooking: builder.mutation({
            query: ({orderId}) => ({ 
            url: 'cancel-driver-booking',
            method:'PUT',
            body:{orderId},
        }),
        invalidatesTags: ['users','cabs','orders'],
        }),
        completeBooking: builder.mutation({
            query: ({orderId}) => ({ 
            url: 'complete-driver-booking',
            method:'PUT',
            body:{orderId},
        }),
        invalidatesTags: ['users','cabs','orders'],
        }),
    }),
});
export const { useDocVerificationMutation, useDriverBookingQuery,useConfirmBookingMutation,useCancelBookingMutation,useCompleteBookingMutation } = driverApi;