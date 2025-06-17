import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import createAdminAxiosInstance from '../../../config/AdminAxsiosInstant';

// Fetch Orders
const fetchOrders = createAsyncThunk('orders/fetchOrders', async ({ page = 1, limit = 10, status = 'all' }) => {
    try {
        const axiosInstance = createAdminAxiosInstance(false);
        const response = await axiosInstance.get('api/orders', {
            params: {
                page,
                limit,
                status: status === 'all' ? undefined : status
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
});
// Update Order Status
const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async ({orderId, status}) => {
    try {
        const axiosInstance = createAdminAxiosInstance(false);
        const response = await axiosInstance.put(`api/order/${orderId}`, {
            status: status
        });
        return response.data;
    } catch (error) {
        throw error;
    }
});
// Delete Order
const deleteOrder = createAsyncThunk('orders/deleteOrder', async (orderId) => {
    try {
        const axiosInstance = createAdminAxiosInstance(true);
        const response = await axiosInstance.delete(`api/order/${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
});


export { fetchOrders, updateOrderStatus, deleteOrder };
