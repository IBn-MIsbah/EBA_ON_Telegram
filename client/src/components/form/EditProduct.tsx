import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Package,
  DollarSign,
  Layers,
  Image as ImageIcon,
  Save,
  ArrowLeft,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { getProductById, updatedProduct } from "../../services/product-api";
import {
  productUpdateInputSchema,
  type ProductUpdateInput,
  type Product,
} from "../../schemas/productSchema";
import { toast } from "sonner";

const SERVER_URL = "http://localhost:5000";

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProductUpdateInput>({
    resolver: zodResolver(productUpdateInputSchema) as any,
  });

  const descriptionValue = watch("description") || "";
  const isAvailableStatus = watch("isAvailable");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await getProductById(id);
        const data: Product = response.data;

        reset({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          isAvailable: data.isAvailable,
        });

        if (data.imageUrl) {
          setPreview(`${SERVER_URL}${data.imageUrl}`);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProduct();
  }, [id, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProductUpdateInput, e: any) => {
    if (!id) return;
    setLoading(true);

    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.price !== undefined) formData.append("price", String(data.price));
    if (data.stock !== undefined) formData.append("stock", String(data.stock));
    if (data.isAvailable !== undefined)
      formData.append("isAvailable", String(data.isAvailable));

    const fileInput = e.target.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append("image", fileInput.files[0]);
    }

    try {
      await updatedProduct(id, formData as any);
      toast.success("Product updated successfully!", {
        duration: 3000,
      });
      navigate("/");
    } catch (err) {
      toast.error("Update failed", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="size-12 border-4 border-[#13ec37]/20 border-t-[#13ec37] rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
          Loading Product...
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- Header --- */}
      <header className="max-w-4xl mx-auto w-full mb-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-xs font-black uppercase tracking-widest">
            Back to Inventory
          </span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Edit Product
              </h2>
              {isAvailableStatus ? (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-500/20">
                  <CheckCircle2 size={12} /> Live
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-500/20">
                  <Clock size={12} /> Hidden
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-500">
              Update details and stock for this item.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading || !isDirty}
              className="flex items-center gap-2 px-8 py-3 bg-[#13ec37] text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#11d632] shadow-lg shadow-[#13ec37]/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              {loading ? (
                <div className="size-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Update Product
            </button>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto space-y-10 pb-20"
      >
        {/* --- Section 1: Identity --- */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-400">
            <Package size={16} className="text-[#13ec37]" /> Product Identity
          </h3>
          <div className="bg-white dark:bg-[#111c13] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                Product Name
              </label>
              <input
                {...register("name")}
                className={`w-full px-5 py-4 bg-slate-50 dark:bg-black/20 border rounded-2xl outline-none transition-all font-bold ${
                  errors.name
                    ? "border-red-500"
                    : "border-slate-100 dark:border-slate-800 focus:border-[#13ec37]"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-[10px] font-bold uppercase ml-1 tracking-wider">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Description
                </label>
                <span className="text-[10px] font-bold text-slate-400">
                  {descriptionValue.length} / 500
                </span>
              </div>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-medium resize-none"
              />
            </div>
          </div>
        </section>

        {/* --- Section 2: Media --- */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-400">
            <ImageIcon size={16} className="text-[#13ec37]" /> Media Preview
          </h3>
          <div className="bg-white dark:bg-[#111c13] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="size-48 rounded-3xl overflow-hidden border-2 border-[#13ec37] shadow-xl bg-black flex-shrink-0 relative group">
                <img
                  src={preview || ""}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-[10px] text-white font-black uppercase tracking-widest">
                    Current Image
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="p-5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-black/10">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                    Replace Image
                  </p>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="size-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:bg-[#13ec37] group-hover:text-black transition-all">
                      <Upload size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      Choose new file...
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <div className="flex items-start gap-2 text-slate-400">
                  <AlertCircle size={14} className="mt-0.5" />
                  <p className="text-[10px] font-bold uppercase tracking-tighter">
                    New uploads will automatically replace the existing product
                    photo upon saving.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Section 3: Numbers --- */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-400">
            <DollarSign size={16} className="text-[#13ec37]" /> Price & Stock
          </h3>
          <div className="bg-white dark:bg-[#111c13] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                  Price (USD)
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    $
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    className="w-full pl-10 pr-5 py-4 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-black text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                  Stock Units
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Layers size={18} />
                  </div>
                  <input
                    type="number"
                    {...register("stock", { valueAsNumber: true })}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-black text-lg"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                  Visibility Status
                </label>
                <select
                  {...register("isAvailable")}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-bold appearance-none cursor-pointer"
                >
                  <option value="true">Live & Available</option>
                  <option value="false">Hidden from Customers</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default EditProduct;
