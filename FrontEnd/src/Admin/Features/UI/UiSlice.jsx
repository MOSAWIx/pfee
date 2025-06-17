// features/ui/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getFromLocalStorage, setToLocalStorage } from '../../../Helpers/Storage';

// Initial State
const initialState = {
    darkMode: getFromLocalStorage("darkMode") ? true : false,
    showMenuIcons: getFromLocalStorage("showMenuIcons") ? true : false,
    showOverllay: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
            setToLocalStorage("darkMode", state.darkMode);
        },

        toggleMenuIcons: (state) => {
            state.showMenuIcons = !state.showMenuIcons;
            setToLocalStorage("showMenuIcons", state.showMenuIcons);
        },
        handleOverllay: (state, action) => {
            state.showOverllay = action.payload;
        },
    },
});

export const { toggleDarkMode, toggleMenuIcons, handleOverllay } = uiSlice.actions;
export default uiSlice.reducer;
