// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   loading: false,
//   user: null,
//   error: null,
//   token: null,
// };

// export const userReducer = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     authRequest: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     authSuccess: (state, action) => {
//       state.loading = false;
//       state.error = null;
//     },
//     authFailure: (state, action) => {
//       state.loading = false;
//       state.user = null;
//       state.error = action.payload;
//     },
//     userExist: (state, action) => {
//       state.loading = false;
//       state.user = action.payload.user;
//     },
//     userNotExist: (state) => {
//       state.loading = false;
//       state.user = null;
//     },
//     logout: (state) => {
//       state.loading = false;
//       state.user = null;
//       state.error = null;
//     },
//   },
// });

// export const { authRequest, authSuccess, authFailure, userExist,userNotExist,logout} = userReducer.actions;

// export default userReducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  user: JSON.parse(localStorage.getItem('user')) || null,
  error: null,
};

export const userReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.user = null;  
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // state.user = action.payload.user;
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.user = null;  
      state.error = action.payload;
      localStorage.removeItem('user');
  },
    userExist: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    userNotExist: (state) => {
      state.loading = false;
      state.user = null;
      localStorage.removeItem('user');
    },
    logout: (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
      state.token = null;
      localStorage.removeItem('user');
      // localStorage.removeItem('token');
    },
  },
});

export const { 
  authRequest, 
  authSuccess, 
  authFailure, 
  userExist,
  userNotExist,
  logout
} = userReducer.actions;

export default userReducer;