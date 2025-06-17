import { createSlice } from "@reduxjs/toolkit";
import { actGetAllCategory } from "./CategoryAction";

const initialState = {
    category: [],
    loading: false,
    error: null
}

const categorySlice = createSlice({
    name: "category",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(actGetAllCategory.pending , (state) => {
            state.loading = true;
        }),
        builder.addCase(actGetAllCategory.fulfilled , (state , action) => {
            state.loading = false;
            state.category = action.payload.categories;
        }),
        builder.addCase(actGetAllCategory.rejected , (state , action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
    }
})

export default categorySlice.reducer;
