import React, { useEffect, useState } from "react";
import type { Product } from "../../schemas/productSchema";
import { getProducts } from "../../services/product-api";
import { Link } from "react-router-dom";
import { Edit3, Eye, Trash2 } from "lucide-react";

const ListProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 font-bold text-slate-400">
        Syncing Inventory...
      </div>
    );

  return (
    // Inside ListProducts.tsx - returning updated grid classes
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((p) => (
        <div
          key={p._id}
          className="bg-white dark:bg-[#111c13] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        >
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img
              src={`${SERVER_URL}${p.imageUrl}`}
              alt={p.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
              <span className="text-white text-xs font-black tracking-widest">
                ${p.price}
              </span>
            </div>
          </div>

          <div className="p-5 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-black text-lg tracking-tight leading-tight">
                {p.name}
              </h3>
              <span
                className={`mt-1.5 size-2 rounded-full ${
                  p.isAvailable ? "bg-[#13ec37]" : "bg-red-500"
                }`}
              ></span>
            </div>

            <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-4">
              {p.description}
            </p>

            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  p.stock < 5 ? "text-red-500" : "text-slate-400"
                }`}
              >
                Stock: {p.stock}
              </span>
              <Link
                to={`/product/${p._id}`}
                className="text-xs font-black text-[#13ec37] uppercase tracking-wider"
              >
                Edit →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListProducts;
