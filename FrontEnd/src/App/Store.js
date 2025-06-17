import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import UiSlice from "../Admin/Features/UI/UiSlice";
import adminAuthSlice from "../Admin/Features/AdminAuth/AdminAuthSlice";
import AdminCategorieSlice from "../Admin/Features/CategorieAdmin/CategorieAdminSlice";
import ordersAdminSlice from "../Admin/Features/Orders/OrdersAdminSlice";
import productAdminSlice from "../Admin/Features/ProductsAdmin/ProductAdminSlice";
import settingsSlice from "../Admin/Features/Settings/SettingsSlice.jsx"
import logoslice from "../Admin/Features/Settings/logoSlice/LogoSlice.jsx"
import heroSectionSlice from "../Admin/Features/Settings/heroSlice/heroSlice.jsx";
// Root Reducer
import ProductSlider from "../Features/Products/ProductsSlice.jsx";
import categorySlice from "../Features/Category/CategorySlice";
import collectionsSlice from "../Features/Collection/CollectionsSlice.jsx";
// Global State Of Admin Panel
const AdminReducer = combineReducers({
    ui: UiSlice,
    adminAuth: adminAuthSlice,
    categories: AdminCategorieSlice,
    products: productAdminSlice,
    orders: ordersAdminSlice,
    settings:settingsSlice,
    logo : logoslice,
    heroSection : heroSectionSlice,
});

const rootReducers = combineReducers({
    products : ProductSlider,
    categories : categorySlice,
    collections : collectionsSlice,
})

const store = configureStore({
    reducer: {
        root: rootReducers,
        admin: AdminReducer,
    }
});
export default store;