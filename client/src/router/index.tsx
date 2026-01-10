import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const MainLayout = lazy(() => import("@/layout/MainLayout"));
const CreateProduct = lazy(() => import("@/components/form/CreateProductForm"));
const Login = lazy(() => import("@/page/Login"));
const ProductDetail = lazy(() => import("@/page/ProductDetail"));
const Dashboard = lazy(() => import("@/page/Dashboard"));
const EditProduct = lazy(() => import("@/components/form/EditProduct"));
const OrderPage = lazy(() => import("../page/Order"));
const Settings = lazy(() => import("@/page/Settings"));
const OrderDetail = lazy(() => import("@/page/OrderDetail"));
const NotFound = lazy(() => import("@/page/NotFound"));
const Users = lazy(() => import("@/page/Users"));

import { ProtectedRoute } from "@/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ), // Wraps all pages with Navbar/Footer
    children: [
      { index: true, element: <Dashboard /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/product/:id/edit", element: <EditProduct /> },
      { path: "/create-product", element: <CreateProduct /> },
      { path: "/orders", element: <OrderPage /> },
      { path: "/orders/:id", element: <OrderDetail /> },
      { path: "/settings", element: <Settings /> },
      { path: "/users", element: <Users /> },
    ],
  },
  { path: "login", element: <Login /> },
  {
    path: "*",
    element: <NotFound />,
  },
]);
