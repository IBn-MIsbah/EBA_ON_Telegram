import React, { useEffect, useState } from "react";
import type { Product } from "../../schemas/productSchema";
import { getProducts } from "../../services/product-api";

const ListProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Define the backend URL for images
  const SERVER_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        // Assuming your API returns { success: true, data: [...] }
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return <div className="p-10 text-center">Loading products...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map((p) => (
          <div
            key={p._id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Prefix the imageUrl with your server URL 
                Example: http://localhost:5000/public/uploads/123.jpg 
            */}
            <img
              src={`${SERVER_URL}${p.imageUrl}`}
              alt={p.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                // Fallback image if the upload fails or path is wrong
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/300";
              }}
            />

            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">{p.name}</h3>
                <span className="text-green-600 font-semibold">${p.price}</span>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {p.description}
              </p>

              <div className="flex justify-between items-center text-xs">
                <span
                  className={p.isAvailable ? "text-blue-500" : "text-red-500"}
                >
                  {p.isAvailable ? `In Stock (${p.stock})` : "Out of Stock"}
                </span>
                <button className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListProducts;
