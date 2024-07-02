import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  user: null,
  error: null,
  token: null,
};

export const userReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
    userExist: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
    },
    userNotExist: (state) => {
      state.loading = false;
      state.user = null;
    },
    logout: (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
    },
  },
});

export const { authRequest, authSuccess, authFailure, userExist,userNotExist,logout} = userReducer.actions;

export default userReducer;