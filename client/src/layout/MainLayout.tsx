// src/layouts/MainLayout.tsx
import { Outlet, Link } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="p-4 bg-white border-b flex gap-6 shadow-sm">
        <Link to="/" className="font-bold text-xl">
          EBA Store
        </Link>
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <Link to="/admin/create-product" className="hover:text-blue-600">
          Add Product
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto py-6">
        <Outlet /> {/* This is where the pages will swap in and out */}
      </main>
    </div>
  );
};

export default MainLayout;
