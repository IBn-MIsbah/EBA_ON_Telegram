/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/product-api";
import type { Product } from "../../schemas/productSchema";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // 1. Initialize state for the product
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const SERVER_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // 2. Fetch data and update state
        const response = await getProductById(id);
        // Assuming your API returns { data: productObject }
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

  // 3. Handle Loading and Error states before rendering the main UI
  if (loading)
    return <div className="p-20 text-center text-xl">Loading product...</div>;
  if (error || !product)
    return (
      <div className="p-20 text-center text-red-500">
        {error || "Product not found"}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen bg-white">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Product Image */}
        <div className="w-full md:w-1/2 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
          <img
            src={`${SERVER_URL}${product.imageUrl}`}
            alt={product.name}
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Right: Product Info */}
        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">
              {product.isAvailable ? "In Stock" : "Currently Unavailable"}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-gray-800 mt-4">
              ${product.price.toLocaleString()}
            </p>
          </div>

          <div className="border-t border-b py-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description ||
                "No description provided for this product."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Inventory: {product.stock} units left</span>
            </div>

            <button
              disabled={!product.isAvailable}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all 
                ${
                  product.isAvailable
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {product.isAvailable ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
