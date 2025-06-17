// heroSliderActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import createAdminAxiosInstance from '../../../../config/AdminAxiosConfig';

// Fetch Hero Slides
export const fetchHeroSlides = createAsyncThunk(
  'heroSlider/fetchHeroSlides',
  async (_, { rejectWithValue }) => {
    try {
      const axiosInstance = createAdminAxiosInstance(true, true);
      const response = await axiosInstance.get('/api/hero-section');
      
      if (response.data.success && response.data.data.heroSection) {
        return response.data.data.heroSection;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching hero slides:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch hero slides'
      );
    }
  }
);

// Create/Update Hero Slides (Combined action since your API handles both)
export const createHeroSlides = createAsyncThunk(
  'heroSlider/createHeroSlides',
  async (slideData, { rejectWithValue }) => {
    try {
      const axiosInstance = createAdminAxiosInstance(true, true);
      
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Prepare slide data with proper indexing
      const processedSlideData = slideData.slides.map((slide, index) => ({
        originalIndex: slide.originalIndex,
        isEdit: slide.isEdit,
        hasNewDesktopImage: slide.hasNewDesktopImage || false,
        hasNewMobileImage: slide.hasNewMobileImage || false,
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        buttonText: slide.buttonText,
        slideIndex: index
      }));

      formData.append("heroSection", JSON.stringify(processedSlideData));

      // Add images with proper indexing
      let desktopImageIndex = 0;
      let mobileImageIndex = 0;

      slideData.slides.forEach((slide, slideIndex) => {
        // For new slides or edited slides with new images
        if (slide.imageFiles?.desktop && (slide.isNew || slide.hasNewDesktopImage)) {
          formData.append(`desktop_images`, slide.imageFiles.desktop);
          formData.append(`desktop_image_slide_${slideIndex}`, desktopImageIndex);
          desktopImageIndex++;
        }
        
        if (slide.imageFiles?.mobile && (slide.isNew || slide.hasNewMobileImage)) {
          formData.append(`mobile_images`, slide.imageFiles.mobile);
          formData.append(`mobile_image_slide_${slideIndex}`, mobileImageIndex);
          mobileImageIndex++;
        }
      });

      const response = await axiosInstance.post('/api/hero-section', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        return {
          message: response.data.message || 'Hero slides created successfully',
          slides: response.data.data?.heroSection || response.data.data || null
        };
      } else {
        return rejectWithValue(response.data.message || 'Failed to create hero slides');
      }
    } catch (error) {
      console.error("Error creating hero slides:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create hero slides'
      );
    }
  }
);

// Update Hero Slides (Alias for createHeroSlides since they use the same endpoint)
export const updateHeroSlides = createAsyncThunk(
  'heroSlider/updateHeroSlides',
  async (slideData, { rejectWithValue }) => {
    try {
      const axiosInstance = createAdminAxiosInstance(true, true);
      
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Prepare slide data with proper indexing
      const processedSlideData = slideData.slides.map((slide, index) => ({
        originalIndex: slide.originalIndex,
        isEdit: slide.isEdit,
        hasNewDesktopImage: slide.hasNewDesktopImage || false,
        hasNewMobileImage: slide.hasNewMobileImage || false,
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        buttonText: slide.buttonText,
        slideIndex: index
      }));

      formData.append("heroSection", JSON.stringify(processedSlideData));

      // Add images with proper indexing
      let desktopImageIndex = 0;
      let mobileImageIndex = 0;

      slideData.slides.forEach((slide, slideIndex) => {
        // For new slides or edited slides with new images
        if (slide.imageFiles?.desktop && (slide.isNew || slide.hasNewDesktopImage)) {
          formData.append(`desktop_images`, slide.imageFiles.desktop);
          formData.append(`desktop_image_slide_${slideIndex}`, desktopImageIndex);
          desktopImageIndex++;
        }
        
        if (slide.imageFiles?.mobile && (slide.isNew || slide.hasNewMobileImage)) {
          formData.append(`mobile_images`, slide.imageFiles.mobile);
          formData.append(`mobile_image_slide_${slideIndex}`, mobileImageIndex);
          mobileImageIndex++;
        }
      });

      const response = await axiosInstance.post('/api/hero-section', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        return {
          message: response.data.message || 'Hero slides updated successfully',
          slides: response.data.data?.heroSection || response.data.data || null
        };
      } else {
        return rejectWithValue(response.data.message || 'Failed to update hero slides');
      }
    } catch (error) {
      console.error("Error updating hero slides:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update hero slides'
      );
    }
  }
);

// Delete Single Hero Slide
export const deleteSingleHeroSlide = createAsyncThunk(
  'heroSlider/deleteSingleHeroSlide',
  async (slideIndex, { rejectWithValue }) => {
    try {
      const axiosInstance = createAdminAxiosInstance(true, true);
      const response = await axiosInstance.delete(`/api/slide/${slideIndex + 1}`);
      
      if (response.data.success) {
        return {
          message: response.data.message || 'Slide deleted successfully',
          deletedSlideIndex: slideIndex
        };
      } else {
        return rejectWithValue(response.data.message || 'Failed to delete slide');
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete slide'
      );
    }
  }
);

// Utility action for batch operations (if needed in the future)
export const batchUpdateHeroSlides = createAsyncThunk(
  'heroSlider/batchUpdateHeroSlides',
  async (batchData, { rejectWithValue }) => {
    try {
      const axiosInstance = createAdminAxiosInstance(true, true);
      console.log("baaaaaaaaaaaaaaaatch " , batchData);
      const response = await axiosInstance.patch(`/api/hero-section/`, batchData);
      
      if (response.data.success) {
        return {
          message: response.data.message || 'Hero slides batch updated successfully',
          slides: response.data.data?.heroSection || response.data.data || null
        };
      } else {
        return rejectWithValue(response.data.message || 'Failed to batch update hero slides');
      }
    } catch (error) {
      console.error("Error batch updating hero slides:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to batch update hero slides'
      );
    }
  }
);

// Reorder Hero Slides (if your API supports reordering)
export const reorderHeroSlides = createAsyncThunk(
  'heroSlider/reorderHeroSlides',
  async (slideOrder, { rejectWithValue }) => {
    try {
      const axiosInstance = createAdminAxiosInstance(false, true);
      const response = await axiosInstance.patch('/api/hero-section/reorder', {
        slideOrder: slideOrder
      });
      
      if (response.data.success) {
        return {
          message: response.data.message || 'Hero slides reordered successfully',
          slides: response.data.data?.heroSection || response.data.data || null
        };
      } else {
        return rejectWithValue(response.data.message || 'Failed to reorder hero slides');
      }
    } catch (error) {
      console.error("Error reordering hero slides:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reorder hero slides'
      );
    }
  }
);