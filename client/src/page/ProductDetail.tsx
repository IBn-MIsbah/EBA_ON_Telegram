/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Product } from "../schemas/productSchema";
import { deleteProduct, getProductById } from "../services/product-api";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State Management
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const SERVER_URL = "http://localhost:5000";

  // Fetch Product on Mount
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("Could not load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle Delete Action
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );

    // Guard clause: stop if user cancels or product is missing
    if (!confirmDelete || !product?._id) return;

    try {
      setLoading(true);
      await deleteProduct(product._id);
      alert("Product deleted successfully!");
      navigate("/"); // Redirect to home/list after deletion
    } catch (err: any) {
      console.error("Delete product error: ", err);
      alert(err.response?.data?.message || "Failed to delete product");
      setLoading(false); // Reset loading so button becomes clickable again
    }
  };

  // Conditional Rendering for Loading and Errors
  if (loading)
    return <div className="p-20 text-center text-xl">Loading product...</div>;
  if (error || !product) {
    return (
      <div className="p-20 text-center text-red-500">
        {error || "Product not found"}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen bg-white">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Left: Product Image */}
        <div className="w-full md:w-1/2 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
          <img
            src={`${SERVER_URL}${product.imageUrl}`}
            alt={product.name}
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right: Product Info */}
        <div className="w-full md:w-1/2 space-y-8">
          <div>
            <span
              className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                product.isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.isAvailable ? "In Stock" : "Out of Stock"}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-light text-gray-600 mt-2">
              ${product.price.toLocaleString()}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase mb-3">
              Description
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {product.description ||
                "No description provided for this product."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-gray-500 flex justify-between items-center">
              <span>Inventory Status</span>
              <span className="font-mono font-bold">
                {product.stock} units left
              </span>
            </div>

            {/* Primary Action: Add to Cart */}
            <button
              disabled={!product.isAvailable}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg
                ${
                  product.isAvailable
                    ? "bg-black text-white hover:bg-gray-800 hover:shadow-xl active:scale-[0.98]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {product.isAvailable ? "Add to Cart" : "Currently Unavailable"}
            </button>

            {/* Admin Actions: Edit & Delete */}
            <div className="grid grid-cols-2 gap-4 mt-8 border-t border-gray-100 pt-8">
              <Link to={`/product/${product._id}/edit`}>
                <button className="w-full py-3 rounded-xl font-bold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all">
                  Edit Details
                </button>
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                className="w-full py-3 rounded-xl font-bold text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition-all"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
