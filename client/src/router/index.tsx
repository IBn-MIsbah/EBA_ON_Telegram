import { createBrowserRouter } from "react-router-dom";
// import CreateProduct from "../components/form/CreateProductForm";
import MainLayout from "../layout/MainLayout";
import CreateProduct from "../components/form/CreateProductForm";
import Login from "../page/Login";
import ProductDetail from "../page/ProductDetail";
import Dashboard from "../page/Dashboard";
import EditProduct from "../components/form/EditProduct";

// Mock auth check (replace with your actual auth logic)
// const isAuthenticated = () => !!localStorage.getItem("token");

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Wraps all pages with Navbar/Footer
    children: [
      { index: true, element: <Dashboard /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "/product/:id/edit", element: <EditProduct /> },
      { path: "admin/create-product", element: <CreateProduct /> },

      //   {
      // path: "admin/create-product",
      // Simple Protected Route Logic
      // element: isAuthenticated() ? (
      //   <CreateProduct />
      // ) : (
      //   <Navigate to="/login" />
      // ),
      //   },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  //   {
  // path: "/login",
  // element: <LoginForm />,
  //   },
  {
    path: "*", // 404 Catch-all
    element: <div className="p-20 text-center">404 - Page Not Found</div>,
  },
]);
