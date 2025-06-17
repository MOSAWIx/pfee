import { lazy } from 'react'

const Products = lazy(() => import('../pages/Products'))
const ProductPage = lazy(() => import('../pages/ProductPage'))
const HomePage = lazy(() => import('../pages/HomePage'))
const OrderSuccess = lazy(() => import('../pages/OrderSuccess'))
const NotFoundEcommerce = lazy(() => import('../pages/NotFound'))
const ProductsCategories= lazy(()=>import('../pages/ProductsOfCategory'))

export {
    NotFoundEcommerce,
    Products,
    ProductPage,
    HomePage,
    OrderSuccess,
    ProductsCategories
}
