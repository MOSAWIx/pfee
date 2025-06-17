import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./Layout/Layout";
// Route Pages
import { Products, ProductPage, HomePage, OrderSuccess ,NotFoundEcommerce,ProductsCategories} from "./RoutePages";

// Admin Pages
import AdminProtected from "../Admin/Routes/AdminProtected";
import AdminLayout from "../Admin/Routes/AdminLayout";
import {
  AdminLogin,
  Categories,
  ShowProducts,
  AddProduct,
  ModifyProduct,
  HomeAdminPage,
  Orders,
  NotFound,
  Settings,
  WebsitePersonalisation,
} from "../Admin/Pages/AdminPages";
import { Toaster } from "react-hot-toast";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<ProductsCategories />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="*" element={<NotFoundEcommerce />} replace={true}/>
        </Route>
        {/* 404 Page */}

        {/* Admin Routes */}
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminProtected />}>
          <Route path="login" element={<AdminLogin />} />
          {/* Admin Layout */}
          <Route path="*" element={<NotFound/>} replace={true} />
          <Route element={<AdminLayout />}>
            <Route index element={<HomeAdminPage />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<ShowProducts />} />
            <Route path="products/add-product" element={<AddProduct />} />
            <Route path="products/modify/:id" element={<ModifyProduct />} />
            <Route path="orders" element={<Orders />} />
            <Route path="settings" element={<Settings />} />
            <Route path="website-settings" element={<WebsitePersonalisation />} />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
