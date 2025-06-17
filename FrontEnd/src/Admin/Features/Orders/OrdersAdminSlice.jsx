import { createSlice } from '@reduxjs/toolkit';
import { fetchOrders, updateOrderStatus, deleteOrder } from './Action/OrderAction';

const initialState = {
    orders: [],
    totalOrders: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null
}

const ordersAdminSlice = createSlice({
    name: 'ordersAdmin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Orders
        builder.addCase(fetchOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload.orders;
            state.totalOrders = action.payload.pagination.total;
            state.currentPage = action.payload.pagination.page;
            state.totalPages = action.payload.pagination.totalPages;
        });
        builder.addCase(fetchOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // Update Order Status
        builder.addCase(updateOrderStatus.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
            const index = state.orders.findIndex(order => order._id === action.payload.order._id);
            if (index !== -1) {
                state.orders[index].status = action.payload.order.status;
            }
            state.loading = false;
        });
        builder.addCase(updateOrderStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // Delete Order
        builder.addCase(deleteOrder.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteOrder.fulfilled, (state, action) => {
            state.orders = state.orders.filter(order => order._id !== action.payload.orderId);
            state.loading = false;
        });
        builder.addCase(deleteOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

export const { } = ordersAdminSlice.actions;
export default ordersAdminSlice.reducer;
