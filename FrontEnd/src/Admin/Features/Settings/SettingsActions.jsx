import { createAsyncThunk } from "@reduxjs/toolkit";
import createAdminAxiosInstance from "../../config/AdminAxsiosInstant";

// Fetch FacebookPixel 
const fetchFacebookPixel = createAsyncThunk("AdminSettings/fetchFacebookPixel", async (_, { rejectWithValue }) => {
    try {
        const axiosInstance = createAdminAxiosInstance(false);
        const response = await axiosInstance.get("/api/facebookPixel");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch Facebook Pixel:", error);
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to fetch Facebook Pixel"
        );
    }
});

// create FacebookPixel
const createFacebookPixel = createAsyncThunk("AdminSettings/createFacebookPixel", async ({ facebookPixelId, isEnabled }, { rejectWithValue }) => {
    try {
        const axiosInstance = createAdminAxiosInstance(true);
        const response = await axiosInstance.post("/api/facebookPixel", { facebookPixelId, active:isEnabled });
        console.log("Facebook Pixel created:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to create Facebook Pixel:", error);
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to create Facebook Pixel"
        );
    }
});




export {
    fetchFacebookPixel,
    createFacebookPixel
};