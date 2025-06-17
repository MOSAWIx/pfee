import { createSlice } from "@reduxjs/toolkit";
import { createProduct, fetchProducts, deleteProduct } from "./Action/ProductAdminActions";




const initialState = {
    products: [],
    loading:    false,
    error: null,
    selectedProduct: null,
    showDeleteConfirm: false,
};

const productAdminSlice = createSlice({
    name: "productAdmin",
    initialState,
    reducers: {
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
        setShowDeleteConfirm: (state, action) => {
            state.showDeleteConfirm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload.product);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(product => product._id !== state.selectedProduct);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setSelectedProduct, setShowDeleteConfirm } = productAdminSlice.actions;
export default productAdminSlice.reducer;





