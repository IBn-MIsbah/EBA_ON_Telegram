import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Upload,
  Package,
  DollarSign,
  List,
  FileText,
  CheckCircle,
} from "lucide-react"; // Optional: npm install lucide-react
import {
  productCreateInputSchema,
  type ProductCreateInput,
} from "../../schemas/productSchema";
import { postProduct } from "../../services/product-api";

const CreateProduct: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductCreateInput>({
    resolver: zodResolver(productCreateInputSchema) as any,
    defaultValues: { isAvailable: true },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProductCreateInput, e: any) => {
    const fileInput = e.target.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const imageFile = fileInput?.files?.[0];

    if (!imageFile) return alert("Please upload a product image!");

    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("isAvailable", String(data.isAvailable));
    formData.append("image", imageFile);

    try {
      const response = await postProduct(formData);
      alert(response.message);
      reset();
      setPreview(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="bg-gray-900 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-green-400" />
              Inventory Management
            </h2>
            <p className="text-gray-400 text-sm">
              Add a new item to your store catalog
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Custom Image Upload Section */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Product Media
              </label>
              <div className="relative group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-green-500 transition-all cursor-pointer overflow-hidden">
                {preview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold text-sm">
                        Click to change image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Upload className="w-12 h-12 mb-2 group-hover:text-green-500 transition-colors" />
                    <p className="font-medium">Click to upload product image</p>
                    <p className="text-xs">PNG, JPG or WEBP (Max 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600 ml-1">
                  Product Name
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    {...register("name")}
                    placeholder="e.g. Arabica Dark Roast"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                      errors.name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600 ml-1">
                  Unit Price ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="0.00"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                      errors.price
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600 ml-1">
                  Initial Stock
                </label>
                <div className="relative">
                  <List className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    {...register("stock", { valueAsNumber: true })}
                    placeholder="100"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                      errors.stock
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              {/* Availability */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600 ml-1">
                  Status
                </label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    {...register("isAvailable")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white"
                  >
                    <option value="true">Active / Available</option>
                    <option value="false">Hidden / Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-600 ml-1 text-center">
                Full Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  {...register("description")}
                  placeholder="Tell customers about this product..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 hover:shadow-green-300 active:scale-[0.98] transition-all disabled:bg-gray-300 disabled:shadow-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </div>
              ) : (
                "Publish Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
