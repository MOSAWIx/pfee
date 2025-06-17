import { createSlice } from '@reduxjs/toolkit';
import { loginAdmin, logoutAdmin } from './AdminAuthActions/AdminAuthAction';
import { getFromLocalStorage, setToLocalStorage } from '../../../Helpers/Storage';

const initialState = {
  isAuthenticated: getFromLocalStorage('adminToken') ? true : false,
  admin: getFromLocalStorage('Admin') || null,
  loading: false,
  error: null,
  token: getFromLocalStorage('adminToken') || null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login Admin
    builder.addCase(loginAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.error = null;
      state.admin = action.payload.Admin;
      setToLocalStorage('Admin', action.payload.Admin);
      setToLocalStorage('adminToken', action.payload.token);
    });
    builder.addCase(loginAdmin.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.error.message || 'Login failed';
    });
    // Logout Admin
    builder.addCase(logoutAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(logoutAdmin.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      setToLocalStorage('adminToken', null);
    });

    builder.addCase(logoutAdmin.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = action.error.message || 'Logout failed';
    });
  },
});

export default adminAuthSlice.reducer;
