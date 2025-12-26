/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isLoading, user, logout } = useAuth();

  const navigate = useNavigate();

  const hadleLogOut = async () => {
    try {
      await logout();
      alert("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error("Logout err: ", err);
    }
  };

  // 1. Show a loader while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 2. Only render the layout if the user exists
  return (
    <>
      {user ? (
        <div className="min-h-screen bg-gray-50">
          <nav className="p-4 bg-white border-b flex items-center justify-between shadow-sm">
            <div className="flex gap-6 items-center">
              <Link to="/" className="font-bold text-xl text-blue-600">
                EBA Store
              </Link>
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link
                to="/admin/create-product"
                className="hover:text-blue-600 transition-colors"
              >
                Add Product
              </Link>
            </div>

            {/* Display User Name/Avatar */}
            <div className="relative flex items-center gap-4">
              <span className="hidden sm:inline text-sm font-semibold text-gray-700">
                {user.name}
              </span>

              <div className="relative">
                <button
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-blue-700 transition-all shadow-md focus:ring-2 focus:ring-blue-300 outline-none"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <>
                    {/* Transparent overlay to close dropdown when clicking outside */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsOpen(false)}
                    ></div>

                    <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-20 animate-in fade-in zoom-in duration-150">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-bold truncate text-gray-800">
                          {user.name}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        My Profile
                      </Link>

                      <button
                        onClick={hadleLogOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 px-4">
            <Outlet context={{ user }} />{" "}
            {/* You can pass user data to child routes via context */}
          </main>
        </div>
      ) : null}
    </>
  );
};

export default MainLayout;
