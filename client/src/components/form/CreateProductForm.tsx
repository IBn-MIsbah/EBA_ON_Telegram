import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Upload,
  Package,
  DollarSign,
  Layers,
  Check,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  productCreateInputSchema,
  type ProductCreateInput,
} from "@/schemas/productSchema";
import { postProduct } from "@/services/product-api";

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductCreateInput>({
    resolver: zodResolver(productCreateInputSchema) as any,
    defaultValues: { isAvailable: true, description: "" },
  });

  // Watch the image field and description for live updates
  const descriptionValue = watch("description") || "";
  const imageFileList = watch("image" as any);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setPreview(null);
    setValue("image" as any, null); // Clear the form value
  };

  const onSubmit = async (data: ProductCreateInput) => {
    // Get the file from the watched file list
    const imageFile = imageFileList?.[0];

    if (!imageFile && !preview) {
      return toast.error("Deployment Error", {
        description: "Please upload a product image before saving.",
      });
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("isAvailable", String(data.isAvailable));
    formData.append("image", imageFile);

    try {
      await postProduct(formData);

      toast.success("Product Created", {
        description: `${data.name} has been added to the inventory.`,
      });

      reset();
      setPreview(null);
      // Optional: Redirect after success
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      toast.error("Process Failed", {
        description: error.response?.data?.message || "Failed to save product.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 md:p-10 animate-in fade-in duration-500 font-display">
      {/* --- Header Section --- */}
      <header className="max-w-4xl mx-auto w-full mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">
            Registry Entry
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
            Internal Inventory Protocol
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Abort
          </Link>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-[#13ec37] text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#11d632] shadow-lg shadow-[#13ec37]/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check size={18} strokeWidth={3} />
            )}
            Sync Product
          </button>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto space-y-10 pb-20"
      >
        {/* --- Section 1: Basic Info --- */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <Package size={14} className="text-[#13ec37]" /> Core Parameters
          </h3>
          <div className="bg-white dark:bg-[#111c13] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Designation Name
              </label>
              <input
                {...register("name")}
                className={`w-full px-5 py-4 bg-slate-50 dark:bg-black/20 border rounded-2xl outline-none transition-all font-bold ${
                  errors.name
                    ? "border-red-500 ring-4 ring-red-500/10"
                    : "border-slate-100 dark:border-slate-800 focus:border-[#13ec37]"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-[10px] font-black uppercase ml-1 tracking-wider">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Data Description
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  [{descriptionValue.length}/500]
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

        {/* --- Section 2: Images --- */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <ImageIcon size={14} className="text-[#13ec37]" /> Visual Asset
          </h3>
          <div className="bg-white dark:bg-[#111c13] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl cursor-pointer bg-slate-50 dark:bg-black/20 hover:bg-[#13ec37]/5 hover:border-[#13ec37] transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="size-14 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="text-slate-400 group-hover:text-[#13ec37]" />
                  </div>
                  <p className="mb-1 text-xs font-black uppercase tracking-tighter">
                    Initialize Upload
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Standard Web Formats Max 5MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("image" as any, { onChange: handleFileChange })}
                />
              </label>
            ) : (
              <div className="relative w-full max-w-sm aspect-square mx-auto rounded-3xl overflow-hidden border-4 border-[#13ec37] shadow-2xl group">
                <img src={preview} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                >
                  <div className="bg-red-500 p-3 rounded-full text-white transform scale-90 group-hover:scale-100 transition-transform">
                    <X size={24} />
                  </div>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* --- Section 3: Pricing & Inventory --- */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <DollarSign size={14} className="text-[#13ec37]" /> Financials &
            Logistics
          </h3>
          <div className="bg-white dark:bg-[#111c13] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Unit Valuation (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-black">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    className="w-full pl-10 pr-5 py-4 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-black text-lg"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-[10px] font-black uppercase ml-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Volume Count
                </label>
                <div className="relative">
                  <Layers
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="number"
                    {...register("stock", { valueAsNumber: true })}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-black text-lg"
                  />
                </div>
                {errors.stock && (
                  <p className="text-red-500 text-[10px] font-black uppercase ml-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Availability Protocol
                </label>
                <select
                  {...register("isAvailable")}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer"
                >
                  <option value="true">Active Transaction</option>
                  <option value="false">System Standby / Draft</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default CreateProduct;
