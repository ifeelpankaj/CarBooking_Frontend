import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const server = import.meta.env.VITE_SERVER
export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/user/`,
    credentials: 'include',
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (user) => ({
        url: "login",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    register: builder.mutation({
      query: (newUser) => ({
        url: "register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["users"],
    }),
    verify: builder.mutation({
      query: (verificationData) => ({
        url: 'verify',
        method: 'POST',
        body: verificationData,
      }),
      invalidatesTags: ['users'],
    }),
    me: builder.query({
      query: () => ({
        url: 'me',
        method: 'GET',
      }),
      providesTags: ['users'],
    }),
    meId: builder.query({
      query: (id) => `userById/${id}`,
      providesTags: ['users'],
    }),
    update: builder.mutation({
      query: (newData) => ({
        url: 'modify',
        method: 'PUT',
        body: newData,
      }),
      invalidatesTags: ['users'],
    }),
    logout: builder.query({
      query: () => ({
        url: 'logout',
        method: 'GET',
      }),
      providesTags: ['users'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useVerifyMutation, useMeQuery, useLazyLogoutQuery, useUpdateMutation, useMeIdQuery } = userAPI;
