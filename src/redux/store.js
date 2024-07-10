import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userApi";
import userReducer from "./reducer/userReducer";
import cabBookingSlice from "./reducer/bookingSlice";
import { cabApi } from "./api/cabApi";
import { orderApi } from "./api/orderApi";



export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [userReducer.name]:userReducer.reducer,

    [cabBookingSlice.name]:cabBookingSlice.reducer,

    //cabs
    [cabApi.reducerPath]:cabApi.reducer,


    //order
    [orderApi.reducerPath]:orderApi.reducer,
 
  },
  middleware: (mid) => [
    ...mid(),
    userAPI.middleware,
    cabApi.middleware,
    orderApi.middleware,
   
  ],
});