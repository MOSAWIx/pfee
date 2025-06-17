export const AdminOrdersSelector = {
    selectOrders: (state) => state.admin.orders.orders,
    selectOrdersLoading: (state) => state.admin.orders.loading,
    selectOrdersError: (state) => state.admin.orders.error,
    selectTotalOrders: (state) => state.admin.orders.totalOrders,
    selectCurrentPage: (state) => state.admin.orders.currentPage,
    selectTotalPages: (state) => state.admin.orders.totalPages
}

export default AdminOrdersSelector;
