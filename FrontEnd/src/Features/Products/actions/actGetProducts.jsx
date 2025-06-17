import { createAsyncThunk } from "@reduxjs/toolkit";
import createAdminAxiosInstance from "../../../config/AdminAxiosConfig";
import WebAxiosConfig from "../../../config/webAxiosConfig";

const actGetProducts = createAsyncThunk("products/getProducts", async (filters = {}, { rejectWithValue }) => {
    const {  size, sizeType, color, minPrice=0, maxPrice, page=1, limit=10 } = filters;
    console.log(filters,"hh");

    try {
        let url = '/products';
        const categoryId = window.location.pathname.split("/")[2];
        
        const queryParams = [];

        if (categoryId) {
            queryParams.push(`category=${categoryId}`);
        }
        if (size) {
            queryParams.push(`size=${size}`);
        }
        if (sizeType) {
            queryParams.push(`sizeType=${sizeType}`);
        }
        if (color) {
            queryParams.push(`color=${color}`);
        }
        // Always include minPrice since it has a default value of 0
        queryParams.push(`minPrice=${Number(minPrice)}`);
        if (maxPrice) {
            queryParams.push(`maxPrice=${Number(maxPrice)}`);
        }
        // Add pagination parameters
        queryParams.push(`page=${page}`);
        queryParams.push(`limit=${limit}`);

        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }

        console.log(url,"url");

        const res = await WebAxiosConfig.get(url);
        const data = await res.data;

        return data || [];
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

// get product by id
const getProductById = createAsyncThunk("products/getProductById" , async (id , {rejectWithValue}) => {
    try {
        const axiosInstance = createAdminAxiosInstance(false);
        const res = await axiosInstance.get(`/api/product/${id}`);
        

        return res.data;
    } catch (error) {
        return rejectWithValue(error.message); 
    }
})
// get Similar Products
const getSimilarProducts = createAsyncThunk("products/getSimilarProducts" , async (id , {rejectWithValue}) => {
    try {
        const axiosInstance = createAdminAxiosInstance(false);
        const res = await axiosInstance.get(`/api/product/${id}/similar`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})
// Get Collection
const getCollections = createAsyncThunk("products/getCollections", async ( { rejectWithValue }) => {
    try {
        const axiosInstance = createAdminAxiosInstance(false);
        const res = await axiosInstance.get(`/api/collections`);
        console.log(res.data, "collections data");
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export {actGetProducts , getProductById , getSimilarProducts , getCollections};