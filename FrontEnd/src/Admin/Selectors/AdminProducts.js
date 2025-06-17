
export const AdminProducts={
    products: (state) => state.admin.products.products,
    loading: (state) => state.admin.products.loading,
    error: (state) => state.admin.products.error,
    showDeleteConfirm: (state) => state.admin.products.showDeleteConfirm,
    selectedProduct: (state) => state.admin.products.selectedProduct,
}