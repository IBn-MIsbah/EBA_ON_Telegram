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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Custom Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const confirmDelete = async () => {
    if (!product?._id) return;

    try {
      setIsDeleting(true);
      await deleteProduct(product._id);

      toast.success("System Purge Complete", {
        description: `${product.name} has been removed from the registry.`,
      });

      navigate("/");
    } catch (err: any) {
      toast.error("Deletion Failed", {
        description: err.response?.data?.message || "Failed to purge record.",
      });
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading && !isDeleteModalOpen)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-12 w-12 border-4 border-slate-200 border-t-[#13ec37] rounded-full animate-spin"></div>
        <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">
          Decrypting_Data...
        </p>
      </div>
    );

  if (error || !product)
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
        <AlertTriangle className="text-red-500" size={48} />
        <p className="font-black uppercase tracking-widest text-xs text-slate-600 dark:text-slate-400">
          {error || "Record Not Found"}
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-primary/10 text-primary rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-all"
        >
          Return to Registry
        </button>
      </div>
    );

  return (
    <div className="p-5 md:p-10 animate-in fade-in duration-500 relative">
      {/* --- CUSTOM CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
          <div className="bg-white dark:bg-[#0a0f0b] border-2 border-red-500/30 w-full max-w-md rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-in zoom-in-95 fade-in duration-200">
            <div className="p-8 space-y-6">
              <div className="size-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
                <AlertTriangle size={32} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight italic">
                  Confirm Purge
                </h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wide">
                  You are about to permanently delete{" "}
                  <span className="text-red-500">{product.name}</span>. This
                  action is irreversible.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="w-full py-4 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Execute Deletion
                </button>
                <button
                  disabled={isDeleting}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Abort Mission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Breadcrumbs & Header --- */}
      <div className="max-w-6xl mx-auto w-full mb-8">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 font-mono">
          <Link to="/" className="hover:text-primary transition-colors">
            Registry
          </Link>
          <ChevronRight size={12} className="text-primary" />
          <span className="text-slate-900 dark:text-white">Record_Detail</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">
              {product.name}
            </h2>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                  product.isAvailable
                    ? "bg-[#13ec37]/10 text-[#13ec37] border-[#13ec37]/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}
              >
                {product.isAvailable ? "Status: Active" : "Status: Offline"}
              </span>
              <span className="text-slate-400 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                <Tag size={12} className="text-primary" /> ID:{" "}
                {product._id?.slice(-8).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/product/${product._id}/edit`}
              className="flex items-center gap-2 px-6 py-3 bg-[#13ec37] text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#11d632] shadow-lg shadow-[#13ec37]/20 transition-all active:scale-95"
            >
              <Edit3 size={18} /> Modify Record
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white dark:bg-[#111c13] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Info size={18} className="text-[#13ec37]" />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">
                General Data Info
              </h3>
            </div>
            <div className="p-8 space-y-8">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">
                  Summary
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {product.description || "No description provided."}
                </p>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-black/40 border-2 border-slate-100 dark:border-slate-800/50">
                <img
                  src={`${SERVER_URL}${product.imageUrl}`}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white dark:bg-[#111c13] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Current Valuation
                </span>
                <p className="text-4xl font-black text-[#13ec37] italic tracking-tighter">
                  ${product.price.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Inventory Units
                </span>
                <p className="text-2xl font-black">{product.stock}</p>
              </div>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <Package size={14} className="text-[#13ec37]" /> Logged System
                Sync
              </div>
            </div>
          </section>

          <section className="bg-red-50/30 dark:bg-red-950/10 rounded-3xl border border-red-100 dark:border-red-900/30 p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400 mb-4">
              Termination Zone
            </h3>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/10"
            >
              <Trash2 size={16} /> Purge Record
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
