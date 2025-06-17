// heroSliderSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchHeroSlides, 
  createHeroSlides, 
  updateHeroSlides, 
  deleteSingleHeroSlide 
} from './heroAction';

const initialState = {
  slides: [],
  loading: false,
  error: null,
  lastUpdated: null,
  operationStatus: {
    fetch: 'idle', // 'idle', 'pending', 'fulfilled', 'rejected'
    create: 'idle',
    update: 'idle',
    delete: 'idle'
  }
};

const heroSliderSlice = createSlice({
  name: 'heroSlider',
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
    resetOperationStatus: (state, action) => {
      const operation = action.payload;
      if (operation && state.operationStatus[operation]) {
        state.operationStatus[operation] = 'idle';
      } else {
        // Reset all operation statuses
        Object.keys(state.operationStatus).forEach(key => {
          state.operationStatus[key] = 'idle';
        });
      }
    },
    setSlides: (state, action) => {
      state.slides = action.payload;
      state.lastUpdated = new Date().toISOString();
    }
  },
  extraReducers: (builder) => {
    // Fetch Hero Slides
    builder
      .addCase(fetchHeroSlides.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operationStatus.fetch = 'pending';
      })
      .addCase(fetchHeroSlides.fulfilled, (state, action) => {
        state.loading = false;
        state.slides = action.payload;
        state.error = null;
        state.operationStatus.fetch = 'fulfilled';
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchHeroSlides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operationStatus.fetch = 'rejected';
      })

    // Create Hero Slides
    builder
      .addCase(createHeroSlides.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operationStatus.create = 'pending';
      })
      .addCase(createHeroSlides.fulfilled, (state, action) => {
        state.loading = false;
        // If the response includes updated slides, use them
        if (action.payload.slides) {
          state.slides = action.payload.slides;
        }
        state.error = null;
        state.operationStatus.create = 'fulfilled';
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createHeroSlides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operationStatus.create = 'rejected';
      })

    // Update Hero Slides
    builder
      .addCase(updateHeroSlides.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operationStatus.update = 'pending';
      })
      .addCase(updateHeroSlides.fulfilled, (state, action) => {
        state.loading = false;
        // If the response includes updated slides, use them
        if (action.payload.slides) {
          state.slides = action.payload.slides;
        }
        state.error = null;
        state.operationStatus.update = 'fulfilled';
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateHeroSlides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operationStatus.update = 'rejected';
      })

    // Delete Single Hero Slide
    builder
      .addCase(deleteSingleHeroSlide.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operationStatus.delete = 'pending';
      })
      .addCase(deleteSingleHeroSlide.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted slide from state
        const slideIndex = action.meta.arg; // The slide index passed to the action
        if (typeof slideIndex === 'number' && slideIndex >= 0) {
          state.slides.splice(slideIndex, 1);
        }
        state.error = null;
        state.operationStatus.delete = 'fulfilled';
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteSingleHeroSlide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operationStatus.delete = 'rejected';
      });
  }
});

// Export actions
export const { 
  clearError, 
  resetOperationStatus, 
  setSlides 
} = heroSliderSlice.actions;

// Selectors
export const selectHeroSlides = (state) => state.admin.heroSection?.slides || [];
export const selectHeroSliderLoading = (state) => state.admin.heroSection?.loading || false;
export const selectHeroSliderError = (state) => state.admin.heroSection?.error;
export const selectHeroSliderOperationStatus = (state) => state.admin.heroSection?.operationStatus;
export const selectHeroSliderLastUpdated = (state) => state.admin.heroSection?.lastUpdated;

// Export reducer
export default heroSliderSlice.reducer;