// appReducer.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocation: localStorage.getItem('currentLocation') || null,
};

export const appReducer = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;console.log("Setting currentLocation to:", action.payload);

      localStorage.setItem('currentLocation', action.payload); // Persist location
    },
  },
});

export const { setCurrentLocation } = appReducer.actions;
export default appReducer;
