import { createAsyncThunk } from '@reduxjs/toolkit';
import createAdminAxiosInstance from '../../../../config/AdminAxiosConfig';
import WebAxiosConfig from '../../../../config/webAxiosConfig';

// Helper function to manage localStorage for logo
const LOGO_CACHE_KEY = 'website_logo_cache';
const LOGO_VERSION_KEY = 'website_logo_version';

const getLogoFromCache = () => {
  try {
    const cachedLogo = localStorage.getItem(LOGO_CACHE_KEY);
    return cachedLogo ? JSON.parse(cachedLogo) : null;
  } catch (error) {
    console.error('Error reading logo from cache:', error);
    return null;
  }
};

const setLogoInCache = (logoData, version = Date.now()) => {
  try {
    localStorage.setItem(LOGO_CACHE_KEY, JSON.stringify(logoData));
    localStorage.setItem(LOGO_VERSION_KEY, version.toString());
  } catch (error) {
    console.error('Error saving logo to cache:', error);
  }
};

const clearLogoCache = () => {
  try {
    localStorage.removeItem(LOGO_CACHE_KEY);
    localStorage.removeItem(LOGO_VERSION_KEY);
  } catch (error) {
    console.error('Error clearing logo cache:', error);
  }
};

// Fetch logo for public website (uses WebAxiosConfig with smart caching)
export const fetchLogo = createAsyncThunk(
  'logo/fetchLogo',
  async ({ forceRefresh = false } = {}, { rejectWithValue }) => {
    try {
      // Check if we should use cache (only for client-side, not admin)
      if (!forceRefresh) {
        const cachedLogo = getLogoFromCache();
        if (cachedLogo) {
          return {
            success: true,
            data: cachedLogo,
            source: 'localStorage'
          };
        }
      }

      // Fetch from server
      const response = await WebAxiosConfig.get('/logo');
      const logoData = response.data.data;

      // Cache the logo data for future use (only on client-side)
      if (logoData && typeof window !== 'undefined') {
        setLogoInCache(logoData);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch logo'
      );
    }
  }
);

// Update logo for admin panel (uses AdminAxiosConfig)
export const updateLogo = createAsyncThunk(
  'logo/updateLogo',
  async ({ logoFile, altText }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);
      if (altText) {
        formData.append('altText', altText);
      }
      
      const axiosInstance = createAdminAxiosInstance(true, true);
      const response = await axiosInstance.post('api/logo', formData);
      
      // Clear the cache after successful update so clients will fetch fresh data
      clearLogoCache();
      
      // Optionally, you could also broadcast to all clients that logo has changed
      // This could be done via WebSocket, Server-Sent Events, or polling
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update logo'
      );
    }
  }
);

// Action to clear logo cache (useful for manual cache invalidation)
export const clearLogoCacheAction = createAsyncThunk(
  'logo/clearCache',
  async (_, { dispatch }) => {
    clearLogoCache();
    // Force fetch fresh data
    return dispatch(fetchLogo({ forceRefresh: true }));
  }
);