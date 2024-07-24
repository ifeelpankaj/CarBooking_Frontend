import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const server = import.meta.env.VITE_SERVER

export const cabApi = createApi({
    reducerPath: 'cabSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/cab/`,
        credentials: 'include',
    }),
    tagTypes: ['users'],
    endpoints: (builder) => ({
        showCabs: builder.query({
            query: () => ({
                url: "getCabs",
                method: "GET",
            }),
            providesTags: ["cabs"],

            transformResponse: (response) => {
                // console.log('Full Response:', response);
                return response.cabs;
            },
        }),
        cabDetail: builder.query({
            query: (id) => `getCabs/${id}`,        
            providesTags:["cabs"],
        }),
        cabRegister: builder.mutation({
            query:(cabData) =>({
                url:"registration",
                method:"POST",
                body:cabData,
            }),
            invalidatesTags:['cabs'],
        }),
        getDriverCab: builder.query({
            query:()=>'getRide',
            providesTags:['cabs']
        }),
        updateCab:builder.mutation({
            query: ({id, newData })=>({
                url:`updateCab/${id}`,
                method:"PUT",
                body:newData,
            }),
            invalidatesTags:['cabs']
        }),
        calculateDistance: builder.query({
            query: ({origin, destination}) => ({
                url: "calculate-distance",
                method: "GET",
                params: { origin, destination }
            }),
            transformResponse: (response) => {
                // Assuming the backend returns the distance and duration
                console.log(response)
                return {
                    distance: response.distance,
                    duration: response.duration
                };
            },
        }),
        
    })

})

export const { useShowCabsQuery,useCabDetailQuery,useCabRegisterMutation ,useGetDriverCabQuery,useUpdateCabMutation,useCalculateDistanceQuery} = cabApi;