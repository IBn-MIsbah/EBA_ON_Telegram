import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Product } from "../schemas/productSchema";
import { deleteProduct, getProductById } from "../services/product-api";
import {
  ChevronRight,
  Trash2,
  Edit3,
  Package,
  Tag,
  Info,
  AlertTriangle,
} from "lucide-react";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const SERVER_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (err: any) {
        setError("Could not load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This action cannot be undone."
    );
    if (!confirmDelete || !product?._id) return;

    try {
      setLoading(true);
      await deleteProduct(product._id);
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete product");
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-12 w-12 border-4 border-slate-200 border-t-[#13ec37] rounded-full animate-spin"></div>
        <p className="font-black uppercase tracking-widest text-xs text-slate-400">
          Syncing Data...
        </p>
      </div>
    );

  if (error || !product)
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <AlertTriangle className="text-red-500" size={48} />
        <p className="font-bold text-slate-600 dark:text-slate-400">
          {error || "Product not found"}
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-primary font-bold"
        >
          Back to Inventory
        </button>
      </div>
    );

  return (
    <div className="p-5 md:p-10 animate-in fade-in duration-500">
      {/* --- Breadcrumbs & Header --- */}
      <div className="max-w-6xl mx-auto w-full mb-8">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
          <Link to="/" className="hover:text-primary transition-colors">
            Inventory
          </Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 dark:text-white">Product Detail</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {product.name}
            </h2>
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                  product.isAvailable
                    ? "bg-[#13ec37]/10 text-[#13ec37]"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {product.isAvailable ? "Active" : "Out of Stock"}
              </span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                <Tag size={12} /> SKU: {product._id?.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <Link
              to={`/product/${product._id}/edit`}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#13ec37] text-black rounded-xl font-bold text-sm hover:bg-[#11d632] shadow-lg shadow-[#13ec37]/20 transition-all active:scale-95"
            >
              <Edit3 size={18} /> Edit Product
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Left Column: Info --- */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white dark:bg-[#111c13] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Info size={18} className="text-[#13ec37]" />
              <h3 className="font-black text-sm uppercase tracking-widest">
                General Information
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Description
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description || "No description provided."}
                </p>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <img
                  src={`${SERVER_URL}${product.imageUrl}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        </div>

        {/* --- Right Column: Pricing & Danger Zone --- */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-[#111c13] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Current Price
                </span>
                <span className="text-2xl font-black text-[#13ec37]">
                  ${product.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Inventory
                </span>
                <span className="text-lg font-black">
                  {product.stock} Units
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Package size={14} className="text-[#13ec37]" />
                Last updated 2 hours ago
              </div>
            </div>
          </section>

          {/* --- Danger Zone --- */}
          <section className="bg-red-50/50 dark:bg-red-950/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400 mb-2">
              Danger Zone
            </h3>
            <p className="text-[10px] text-red-500 font-bold uppercase mb-6 opacity-80">
              Removing this product is permanent and will delete all associated
              analytics.
            </p>
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/40 transition-all"
            >
              <Trash2 size={16} /> Delete Product
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
