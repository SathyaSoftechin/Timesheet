// import { createSlice, combineReducers } from '@reduxjs/toolkit';
// import auth from '../../services/auth';

// const loggedInUser = auth.getCurrentUser();

// const initialAuthState = {
//   isLoggedIn: !!loggedInUser,
//   user: loggedInUser,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: initialAuthState,
// });

// export default combineReducers({
//   userLogin: authSlice.reducer,
// });

// /* SELECTORS */
// export const isUserLoggedIn = (state) => state.auth.userLogin.isLoggedIn;
// export const selectUser = (state) => state.auth.userLogin.user;
// export const getUserRole = (state) => {
//   const role = state.auth.userLogin.user?.role.roleName;
//   return !role ? '' : role.charAt(0).toUpperCase() + role.slice(1);
// };

import { createSlice } from '@reduxjs/toolkit';
import auth from '../../services/auth';

const loggedInUser = auth.getCurrentUser();

const initialState = {
  isLoggedIn: !!loggedInUser,
  user: loggedInUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logoutSuccess(state) {
      state.isLoggedIn = false;
      state.user = null;
      auth.logoutUser();
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

/* SELECTORS */
export const isUserLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const getUserRole = (state) => {
  const role = state.auth.user?.role?.roleName;
  return role ? role.charAt(0).toUpperCase() + role.slice(1) : '';
};

export default authSlice.reducer;
