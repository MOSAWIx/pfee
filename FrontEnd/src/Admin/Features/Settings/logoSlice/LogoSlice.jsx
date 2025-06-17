import { createSlice,  } from '@reduxjs/toolkit';
import {fetchLogo, updateLogo} from './LogoAction';

const logoSlice = createSlice({
    name: 'logo',
    initialState: {
      data: {
        path: null,
        altText: 'Website Logo',
        publicId: null,
      },
      loading: false,
      error: null,
      source: null,
    },
    reducers: {
      clearLogoError: (state) => {
        state.error = null;
      },
      resetLogoState: (state) => {
        state.data = {
          path: null,
          altText: 'Website Logo',
          publicId: null,
        };
        state.loading = false;
        state.error = null;
        state.source = null;
      },
    },
    extraReducers: (builder) => {
      builder
        // Fetch logo
        .addCase(fetchLogo.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchLogo.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload.data;
          state.source = action.payload.source;
        })
        .addCase(fetchLogo.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        // Update logo
        .addCase(updateLogo.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateLogo.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload.data;
          state.source = 'updated';
        })
        .addCase(updateLogo.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });

  export const { clearLogoError, resetLogoState } = logoSlice.actions;
  export default logoSlice.reducer;
  