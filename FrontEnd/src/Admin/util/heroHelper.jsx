const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5555';

// Cache keys
const CACHE_KEYS = {
  HERO_DATA: 'hero_sections',
  HERO_VERSION: 'hero_sections_version',
  HERO_TIMESTAMP: 'hero_sections_timestamp'
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Get cached data from localStorage (fast, no version checking)
const getCachedData = () => {
  try {
    const data = localStorage.getItem(CACHE_KEYS.HERO_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error parsing cached data:', error);
    return null;
  }
};

const getCachedVersion = () => {
  return localStorage.getItem(CACHE_KEYS.HERO_VERSION);
};

const getCachedTimestamp = () => {
  return localStorage.getItem(CACHE_KEYS.HERO_TIMESTAMP);
};

// Check if we have valid cached data
const hasCachedData = () => {
  const data = getCachedData();
  return data && data.length > 0;
};

// Save data to cache
const saveToCache = (data, version, timestamp = null) => {
  try {
    localStorage.setItem(CACHE_KEYS.HERO_DATA, JSON.stringify(data));
    localStorage.setItem(CACHE_KEYS.HERO_VERSION, version || Date.now().toString());
    if (timestamp) {
      localStorage.setItem(CACHE_KEYS.HERO_TIMESTAMP, timestamp);
    }
    console.log(`Hero data cached with version: ${version || 'auto'}`);
    return true;
  } catch (error) {
    console.error('Error saving to cache:', error);
    return false;
  }
};

// Fetch data from server
const fetchFromServer = async () => {
  try {
    console.log('Fetching hero data from server...');
    const response = await apiCall('api/hero/sliders');
    
    if (response.success && response.data) {
      return {
        data: response.data,
        version: response.version,
        timestamp: response.timestamp,
        source: response.source || 'server'
      };
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error fetching from server:', error);
    throw error;
  }
};

// FAST VERSION: Get hero data immediately from cache, update in background
const getHeroData = async ({ forceRefresh = false } = {}) => {
  try {
    console.log('🚀 Getting hero data (fast mode)...');
    
    // If not forcing refresh and we have cached data, return it immediately
    if (!forceRefresh && hasCachedData()) {
      console.log('⚡ Using cached data immediately');
      
      // Start background update (don't await it)
      updateInBackground();
      
      return {
        data: getCachedData(),
        source: 'localStorage',
        version: getCachedVersion(),
        cached: true
      };
    }
    
    console.log('📡 No cache or force refresh - fetching from server');
    
    // Fetch fresh data from server
    try {
      const serverData = await fetchFromServer();
      
      // Save to cache
      saveToCache(serverData.data, serverData.version, serverData.timestamp);
      
      console.log('✅ Fresh data loaded and cached');
      return {
        data: serverData.data,
        source: serverData.source,
        version: serverData.version,
        cached: false
      };
      
    } catch (serverError) {
      console.error('❌ Server fetch failed:', serverError);
      
      // If server fails but we have cached data, use it as fallback
      if (hasCachedData()) {
        console.log('🔄 Using cached data as fallback');
        return {
          data: getCachedData(),
          source: 'localStorage_fallback',
          version: getCachedVersion(),
          cached: true,
          fallback: true
        };
      }
      
      // No cached data and server failed
      throw serverError;
    }
    
  } catch (error) {
    console.error('💥 Error in getHeroData:', error);
    throw error;
  }
};

// Background update function (non-blocking)
const updateInBackground = async () => {
  try {
    console.log('🔄 Background update started...');
    
    // Get server version first
    const serverInfo = await getServerVersion();
    
    if (!serverInfo.success) {
      console.log('🤷 Server unreachable for background update');
      return;
    }
    
    const cachedVersion = getCachedVersion();
    
    // Only update if versions differ
    if (cachedVersion === serverInfo.version) {
      console.log('✅ Background check: Data is current');
      return;
    }
    
    console.log('🔄 Background update: Fetching new data...');
    
    // Fetch fresh data
    const serverData = await fetchFromServer();
    
    // Update cache
    saveToCache(serverData.data, serverData.version, serverData.timestamp);
    
    console.log('✅ Background update completed');
    
    // You could dispatch an event here to notify components about the update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('heroDataUpdated', {
        detail: {
          data: serverData.data,
          version: serverData.version
        }
      }));
    }
    
  } catch (error) {
    console.error('❌ Background update failed:', error);
    // Fail silently - don't affect user experience
  }
};

// Get version from server
const getServerVersion = async () => {
  try {
    const response = await apiCall('api/hero/version');
    return {
      version: response.version,
      timestamp: response.timestamp,
      success: true
    };
  } catch (error) {
    console.error('Error getting server version:', error);
    return {
      version: null,
      timestamp: null,
      success: false,
      error: error.message
    };
  }
};

// Force refresh hero data (bypass cache)
const refreshHeroData = async () => {
  try {
    console.log('🔄 Force refreshing hero data...');
    
    // Clear cache first
    clearHeroCache();
    
    // Fetch fresh data
    const serverData = await fetchFromServer();
    
    // Save to cache
    saveToCache(serverData.data, serverData.version, serverData.timestamp);
    
    console.log('✅ Hero data force refreshed');
    return {
      data: serverData.data,
      source: serverData.source,
      version: serverData.version,
      refreshed: true
    };
    
  } catch (error) {
    console.error('Error refreshing hero data:', error);
    throw error;
  }
};

// Create/Update hero sliders (Admin function)
const createHeroSliders = async (formData) => {
  try {
    console.log('💾 Creating/updating hero sliders...');
    
    const response = await fetch(`${API_BASE_URL}api/hero/sliders`, {
      method: 'POST',
      body: formData, // FormData object with files and data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Hero sliders saved successfully');
      
      // Clear cache to force refresh on next load
      clearHeroCache();
      
      // Optionally cache the new data immediately
      if (result.data && result.version) {
        saveToCache(result.data, result.version, result.timestamp);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error creating hero sliders:', error);
    throw error;
  }
};

// Delete a specific slider (Admin function)
const deleteHeroSlider = async (sliderId) => {
  try {
    console.log(`🗑️ Deleting hero slider: ${sliderId}`);
    
    const response = await apiCall(`api/hero/sliders/${sliderId}`, {
      method: 'DELETE',
    });
    
    if (response.success) {
      console.log('✅ Hero slider deleted successfully');
      
      // Clear cache to force refresh
      clearHeroCache();
      
      // Cache updated data if provided
      if (response.data && response.version) {
        saveToCache(response.data, response.version, response.timestamp);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error deleting hero slider:', error);
    throw error;
  }
};

// Clear hero cache
const clearHeroCache = () => {
  try {
    localStorage.removeItem(CACHE_KEYS.HERO_DATA);
    localStorage.removeItem(CACHE_KEYS.HERO_VERSION);
    localStorage.removeItem(CACHE_KEYS.HERO_TIMESTAMP);
    console.log('🧹 Hero cache cleared');
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
};

// Get cache info (for debugging)
const getCacheInfo = () => {
  const cachedData = getCachedData();
  const cachedVersion = getCachedVersion();
  const cachedTimestamp = getCachedTimestamp();
  
  return {
    hasCachedData: !!cachedData,
    cachedVersion: cachedVersion,
    cachedTimestamp: cachedTimestamp,
    cacheSize: cachedData ? JSON.stringify(cachedData).length : 0,
    itemCount: cachedData ? cachedData.length : 0,
    lastCached: cachedTimestamp || 'Unknown'
  };
};

// Listen for background updates (for React components)
const useHeroDataListener = (callback) => {
  if (typeof window !== 'undefined') {
    const handleUpdate = (event) => {
      callback(event.detail);
    };
    
    window.addEventListener('heroDataUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('heroDataUpdated', handleUpdate);
    };
  }
  
  return () => {}; // No-op cleanup for SSR
};

export {
  getHeroData,
  refreshHeroData,
  createHeroSliders,
  deleteHeroSlider,
  clearHeroCache,
  getCacheInfo,
  useHeroDataListener
};