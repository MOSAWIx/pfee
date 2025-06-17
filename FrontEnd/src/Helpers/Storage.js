// Function to set an item in localStorage
export const setToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage`, error);
    }
};

// Function to get an item from localStorage
export const getFromLocalStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item): null;
    } catch (error) {
        console.error(`Error retrieving ${key} from localStorage`, error);
        return null;
    }
};


// Helper function to remove data from localStorage
export const  removeFromStorage = (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage for ${key}:`, error);
      return false;
    }
  };