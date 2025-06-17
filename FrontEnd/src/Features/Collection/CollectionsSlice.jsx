import { createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {getCollections} from './CollectionAction';


const initialState = {
    items: [],
    loading: false,
    error: null,
};
const collectionsSlice = createSlice({
    name: 'collections',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCollections.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCollections.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.collections;
            })
            .addCase(getCollections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default collectionsSlice.reducer;