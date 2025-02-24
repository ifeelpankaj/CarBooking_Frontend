import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  from: '',
  to: '',
  pickupDate: null,
  dropOffDate: null,
  cabType: 'OneWay',
  distance: '',
};



export const cabBookingSlice = createSlice({
  name: 'cabBooking',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
      sessionStorage.setItem('cabBookingForm', JSON.stringify(state));
    },
    resetForm: (state) => {
      Object.assign(state, initialState);
      sessionStorage.removeItem('cabBookingForm');
    },
  },
});

export const { updateFormField, resetForm } = cabBookingSlice.actions;
export default cabBookingSlice;