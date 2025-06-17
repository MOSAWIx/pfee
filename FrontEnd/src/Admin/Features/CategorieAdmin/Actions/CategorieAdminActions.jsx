import { createAsyncThunk } from "@reduxjs/toolkit";
import createAdminAxiosInstance from "../../../config/AdminAxsiosInstant";

// Fetch Categories Action
const fetchCategories = createAsyncThunk("AdminCategorie/fetchCategories", async (_, { rejectWithValue }) => {
    try {
        const axiosInstance = createAdminAxiosInstance(false);
        const response = await axiosInstance.get("/api/categories");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to fetch categories"
        );
    }
});

// Fetch Category by ID Action
const fetchCategoryById = createAsyncThunk("AdminCategorie/fetchCategoryById", async (id, { rejectWithValue }) => {
    try {
        const axiosInstance = createAdminAxiosInstance(false);
        const response = await axiosInstance.get(`/api/category/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch category:", error);
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to fetch category"
        );
    }
});

// Create Category Action
const createCategory = createAsyncThunk("AdminCategorie/createCategory", async (categoryData, { rejectWithValue }) => {
    try {
        const axiosInstance = createAdminAxiosInstance(true);
        const response = await axiosInstance.post("/api/category", categoryData);
        return response.data;
    } catch (error) {
        console.error("Failed to create category:", error);
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to create category"
        );
    }
});

// Modify Category Action
const modifyCategory = createAsyncThunk("AdminCategorie/modifyCategory", async ({ id,categoryData }, { rejectWithValue }) => {
    try {
        const axiosInstance = createAdminAxiosInstance(true);
        const response = await axiosInstance.put(`/api/category/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Failed to modify category:", error);
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to modify category"
        );
    }
});

// Delete Category Action
const deleteCategory = createAsyncThunk("AdminCategorie/deleteCategory", async (id, { rejectWithValue }) => {
    try {
        const axiosInstance = createAdminAxiosInstance(true);
        const response = await axiosInstance.delete(`/api/category/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete category:", error);
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to delete category"
        );
    }
});

export { fetchCategories, fetchCategoryById, createCategory, modifyCategory, deleteCategory };