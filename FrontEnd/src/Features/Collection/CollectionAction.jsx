import { createAsyncThunk } from "@reduxjs/toolkit";
import createAdminAxiosInstance from "../../Admin/config/AdminAxsiosInstant";


// get collections
export const getCollections = createAsyncThunk("collections/getCollections", async (_, { rejectWithValue }) => {
    try {
        const axiosInstance = createAdminAxiosInstance(false);
        const res = await axiosInstance.get(`/api/collections`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
