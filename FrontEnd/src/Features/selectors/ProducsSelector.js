


import { createSelector } from '@reduxjs/toolkit';

// Base selectors
export const getProducts = (state) => state.root.products.data.products;
export const  getError = (state) => state.root.products.error;
export const getLoading = (state) => state.root.products.isLoading;



// Memoized selectors
const productsSelector = {
    products: createSelector(
        [getProducts],
        (products) => products
    ),
    product: (id) => createSelector(
        [getProducts],
        (products) => products.find(product => product.id === id)
    ),
    similarProducts: (category) => createSelector(
        [getProducts],
        (products) => products.filter(product => product.category === category)
    ),

}

export default productsSelector;


