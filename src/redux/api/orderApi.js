import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const server = import.meta.env.VITE_SERVER

export const orderApi = createApi({
    reducerPath: 'orderSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/order`,
        credentials: 'include',
    }),
    tagTypes: ['orders'],
    endpoints: (builder) => ({
        bookCab: builder.mutation({
            query: (orderDetails) => ({
                url: `/checkout`,
                method: 'POST',
                body: orderDetails,
            }),
            invalidatesTags: ['orders'],
        }),
        paymentVerification: builder.mutation({
            query: ({ razorpay_payment_id, razorpay_order_id, razorpay_signature, orderOptions }) => ({
                url: `/paymentverification`,
                method: 'POST',
                body: {
                    razorpay_payment_id,
                    razorpay_order_id,
                    razorpay_signature,
                    orderOptions,
                },
            }),
            invalidatesTags: ['orders'],
        }),
        myOrder: builder.query({
            query: () => ({
                url: "mybooking",
                method: "GET",
            }),
            providesTags: ["orders"],
        }),
        orderDetail:builder.query({
            query:(id) =>`mybooking/${id}`,
            providesTags:["orders"],
        }),
        getPendingOrder:builder.query({
            query:() =>"pendingorders",
            providesTags:['orders','cab','user'],
        })
    })

})

export const { usePaymentVerificationMutation, useBookCabMutation ,useMyOrderQuery,useOrderDetailQuery ,useGetPendingOrderQuery} = orderApi;