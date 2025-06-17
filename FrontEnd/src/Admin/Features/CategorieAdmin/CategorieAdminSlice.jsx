import { createSlice } from '@reduxjs/toolkit';
import { fetchCategories, createCategory, deleteCategory, modifyCategory } from './Actions/CategorieAdminActions';

// Initial state for the slice
const initialState = {
    categories: [],
    loading: false,
    error: null,
    selectedCategory: null,
    showDeleteConfirmModal: false, // Default to false
    isOpen: false,
    isEdit: false,
};

const AdminCategorieSlice = createSlice({
    name: 'AdminCategorie',
    initialState,
    reducers: {
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        clearSelectedCategory: (state) => {
            state.selectedCategory = null;
        },
        toggleDeleteConfirmModal: (state, action) => {
            state.showDeleteConfirmModal = action.payload;
        },
        setIsOpen: (state, action) => {
            state.isOpen = action.payload;
        },
        setIsEdit: (state, action) => {
            state.isEdit = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch Categories
        builder.addCase(fetchCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload.categories;
        });

        builder.addCase(fetchCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Add Category
        builder.addCase(createCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(createCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = [action.payload.category, ...state.categories]; // Assuming the response contains the created category
        });

        builder.addCase(createCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Delete Category
        builder.addCase(deleteCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = state.categories.filter(
                (category) => category._id !== action.payload.category._id
            ); // Assuming the response contains the deleted category ID
        });
        builder.addCase(deleteCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        // Modify Category
        builder.addCase(modifyCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(modifyCategory.fulfilled, (state, action) => {
            state.loading = false;
            const updatedCategory = action.payload.category;
            const oldCategoryWithoutUpdated=[...state.categories.filter((cat)=>cat._id !== updatedCategory._id)]
            state.categories=[updatedCategory,...oldCategoryWithoutUpdated]
        });
        builder.addCase(modifyCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        
        
        
    },
});

export const { setSelectedCategory, clearSelectedCategory, toggleDeleteConfirmModal, setIsOpen, setIsEdit } = AdminCategorieSlice.actions;
export default AdminCategorieSlice.reducer;
