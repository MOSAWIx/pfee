import { createAsyncThunk } from "@reduxjs/toolkit";
import WebAxiosConfig from "../../config/webAxiosConfig";

// Get All Category
const actGetAllCategory = createAsyncThunk("category/getAllCategory" , async (_,{rejectWithValue}) => {
    try {
        const res = await WebAxiosConfig.get('/categories');
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export {actGetAllCategory};

