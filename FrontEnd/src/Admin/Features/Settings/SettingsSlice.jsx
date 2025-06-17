import { createSlice } from "@reduxjs/toolkit";
import { fetchFacebookPixel,createFacebookPixel } from "./SettingsActions";
const initialState = {
    facebook: {
        facebookPixelId: "",
        active: false
    }
}

const settingsSlice = createSlice({
    name: "AdminSettings",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        // Handle Fetch
            .addCase(fetchFacebookPixel.pending, (state) => {
                // Optionally handle loading state
                console.log("Fetching Facebook Pixel...");
            })
            .addCase(fetchFacebookPixel.fulfilled, (state, action) => {
                state.facebook = action.payload.data;
            })
            .addCase(fetchFacebookPixel.rejected, (state, action) => {
                console.error("Failed to fetch Facebook Pixel:", action.payload);
            })
            // Handle Create
            .addCase(createFacebookPixel.fulfilled, (state, action) => {
                state.facebook = action.payload.data;
            })
            .addCase(createFacebookPixel.rejected, (state, action) => {
                console.error("Failed to create Facebook Pixel:", action.payload);
            });
    }
});

export default settingsSlice.reducer;
