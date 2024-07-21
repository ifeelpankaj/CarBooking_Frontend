import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { transform } from "framer-motion";

const server = import.meta.env.VITE_SERVER

export const driverApi = createApi({
    reducerPath:'driverSlice',
    baseQuery:fetchBaseQuery({
        baseUrl:`${server}/api/v1/driver/`,
        credentials:'include',
    }),
    tagTypes:['users'],
    endpoints:(builder) =>({
        docVerification:builder.mutation({
            query:(doc) =>({
                url:"docverify",
                method:"PUT",
                body:doc,
            }),
            invalidatesTags:['users'],
        }),
        driverBooking: builder.query({
            query:()=>({
                url:'getDriverBooking',
                method:'GET',
            }),
            providesTags:['orders'],
            transformResponse: (response) => {
                // console.log('Full Response:', response);
                return response.bookings;
            },

        })
    }),
});
export const { useDocVerificationMutation ,useDriverBookingQuery} = driverApi;