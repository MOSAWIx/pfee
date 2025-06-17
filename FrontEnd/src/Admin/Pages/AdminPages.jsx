import { lazy } from "react";

const AdminLogin = lazy(() => import("./Login/AdminLogin"));
const Categories = lazy(() => import("./Categories/categories"));
const ShowProducts = lazy(() => import("./Products/ShowProducts"));
const AddProduct = lazy(() => import("./Products/addproduct"));
const ModifyProduct = lazy(() => import("./Products/modifyProduct"));
const HomeAdminPage = lazy(() => import("./Home/Home"));
const Orders = lazy(() => import("./Orders/Orders"));
const NotFound = lazy(() => import("./NotFound"));
const Settings = lazy(() => import("./Settings/Settings"));
const WebsitePersonalisation = lazy(() =>
  import("./Personalisation/WebsitePersonalisation")
);


// Exports All Pages
export {
  NotFound,
  AdminLogin,
  Categories,
  ShowProducts,
  AddProduct,
  ModifyProduct,
  HomeAdminPage,
  Orders,
  Settings,
  WebsitePersonalisation,
};
