import { createAsyncThunk } from "@reduxjs/toolkit";
import createAdminAxiosInstance from "../../../config/AdminAxsiosInstant";

// Create Product Action
const createProduct = createAsyncThunk("AdminProduct/createProduct", async (productData, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        
        // Add basic product information
        formData.append('title', JSON.stringify(productData.title));
        formData.append('description', JSON.stringify(productData.description));
        formData.append('basePrice', productData.basePrice);
        formData.append('discount', productData.discount);
        formData.append('category', productData.category);
        formData.append('active', productData.active);
        formData.append('priceFor2', productData.priceFor2);
        formData.append('priceFor3', productData.priceFor3);
        formData.append('googleSheetId', productData.googleSheetId || ''); // Optional field



        // Add colors as a JSON string
        formData.append('colors', JSON.stringify(productData.colors));

        // Handle color images
        productData.colors.forEach((color) => {
            if (color.images && color.images.length > 0) {
                color.images.forEach((image) => {
                    // Use the English name for consistency
                    formData.append(`color_${color.name.en}`, image);
                });
            }
        });

        console.log(formData);

        const axiosInstance = createAdminAxiosInstance(true, true);
        const response = await axiosInstance.post("/api/product", formData);
        return response.data;
    } catch (error) {
        console.error("Failed to create product:", error);
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to create product"
        );
    }
});
// Fetch Products Action
const fetchProducts = createAsyncThunk("AdminProduct/fetchProducts", async (_, { rejectWithValue }) => {
    try {
        const axiosInstance = createAdminAxiosInstance(false);
        const response = await axiosInstance.get("/api/products");
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.error("Failed to fetch products:", error);
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to fetch products"
        );
    }
});

// Delete Product Action
const deleteProduct = createAsyncThunk("AdminProduct/deleteProduct", async (productId, { rejectWithValue }) => {
    try {
        const axiosInstance = createAdminAxiosInstance(true);
        const response = await axiosInstance.delete(`/api/product/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete product:", error);
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to delete product"
        );
    }
});

// get product by id
const getProductById = createAsyncThunk("AdminProduct/getProductById", async (productId, { rejectWithValue }) => {
    try {
        const axiosInstance = createAdminAxiosInstance(false);
        const response = await axiosInstance.get(`/api/product/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to get product by id:", error);
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to get product by id"
        );
    }
}); 

// update product
const updateProduct = createAsyncThunk("AdminProduct/updateProduct", async (productData, { rejectWithValue }) => {
    try {
        console.log("productData ççççççççççççççççç",productData);
        const formData = new FormData();
        
        // Add basic product data
        formData.append('title', JSON.stringify(productData.title));
        formData.append('description', JSON.stringify(productData.description));
        formData.append('basePrice', productData.basePrice);
        formData.append('discount', productData.discount);
        formData.append('category', productData.category);
        formData.append('active', productData.active);
        formData.append('priceFor2', productData.priceFor2);
        formData.append('priceFor3', productData.priceFor3);
        formData.append('googleSheetId', productData.googleSheetId || ''); // Optional field

        // Handle colors and images
        const colorsData = productData.colors.map((color, colorIndex) => {
            // Separate existing images from new files
            const existingImages = color.images.filter(img => !(img instanceof File));
            const newImages = color.images.filter(img => img instanceof File);
            
            const colorData = {
                name: color.name,
                colorHex: color.colorHex,
                images: existingImages.map(img => ({
                    webpPath: img.webpPath || img.preview,
                    thumbnailPath: img.thumbnailPath,
                    public_id: img.public_id
                })),
                stock: color.stock,
                sizes: color.sizes || [],    // Changed from size to sizes and ensure it's an array
                tailles: color.tailles || [] // Changed from taille to tailles and ensure it's an array
            };
            
            // Append new images to formData
            newImages.forEach((image, imageIndex) => {
                formData.append(`color_${colorIndex}_${imageIndex}`, image);
            });
            
            return colorData;
        });

        formData.append('colors', JSON.stringify(colorsData));

        const axiosInstance = createAdminAxiosInstance(true, true);
        const response = await axiosInstance.put(`/api/product/${productData.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update product:", error);
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to update product"
        );
    }
});

export { createProduct, fetchProducts, deleteProduct, getProductById, updateProduct };


