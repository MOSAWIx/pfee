


export const AdminCategorieSelector = {
    categories: (state) => state.admin.categories.categories,
    loading: (state) => state.admin.categories.loading,
    error: (state) => state.admin.categories.error,
    selectedCategory: (state) => state.admin.categories.selectedCategory,
    showDeleteConfirm: (state) => state.admin.categories.showDeleteConfirmModal,
}