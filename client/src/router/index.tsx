import { createBrowserRouter } from "react-router-dom";
// import CreateProduct from "../components/form/CreateProductForm";
import ListProducts from "../components/form/ListProducts";
import ProductDetail from "../components/page/ProductDetail";
import MainLayout from "../layout/MainLayout";
import Login from "../components/page/Login";
import CreateProduct from "../components/form/CreateProductForm";

// Mock auth check (replace with your actual auth logic)
// const isAuthenticated = () => !!localStorage.getItem("token");

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Wraps all pages with Navbar/Footer
    children: [
      {
        index: true, // This is the default home page (/)
        element: <ListProducts />,
      },
      {
        path: "product/:id", // Dynamic route for details
        element: <ProductDetail />,
      },
      {
        path: "admin/create-product",
        element: <CreateProduct />,
      },
      {
        path: "login",
        element: <Login />,
      },
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
  //   {
  // path: "/login",
  // element: <LoginForm />,
  //   },
  {
    path: "*", // 404 Catch-all
    element: <div className="p-20 text-center">404 - Page Not Found</div>,
  },
]);
