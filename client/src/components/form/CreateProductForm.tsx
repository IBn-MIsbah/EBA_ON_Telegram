/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productCreateInputSchema,
  type ProductCreateInput,
} from "../../schemas/productSchema";
import { postProduct } from "../../services/product-api";

const CreateProduct: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Initialize useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductCreateInput>({
    resolver: zodResolver(productCreateInputSchema) as any,
    defaultValues: {
      isAvailable: true,
    },
  });

  // 2. Handle File selection separately to update preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      // No need to register the file input manually if you use ref,
      // but we handle it via state for the preview
    }
  };

  // 3. Submit logic
  const onSubmit = async (data: ProductCreateInput, e: any) => {
    const fileInput = e.target.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const imageFile = fileInput?.files?.[0];

    if (!imageFile) return alert("Image is required!");

    setLoading(true);

    // Construct FormData
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("isAvailable", String(data.isAvailable));
    formData.append("image", imageFile);

    try {
      // const response = await axios.post(
      //   "http://localhost:5000/api/v1/product",
      //   formData,
      //   {
      //     headers: { "Content-Type": "multipart/form-data" },
      //     withCredentials: true,
      //   }
      // );

      const response = await postProduct(formData);
      alert(response.message);
      reset();
      setPreview(null);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Create New Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image Preview & Input */}
        <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-lg border-gray-200">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded shadow"
            />
          ) : (
            <div className="w-40 h-40 bg-gray-100 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm"
          />
        </div>

        {/* Text Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              {...register("name")}
              placeholder="Product Name"
              className={`w-full border p-2 rounded ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              type="number"
              {...register("price")}
              placeholder="Price"
              className={`w-full border p-2 rounded ${
                errors.price ? "border-red-500" : ""
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              {...register("stock")}
              placeholder="Stock"
              className={`w-full border p-2 rounded ${
                errors.stock ? "border-red-500" : ""
              }`}
            />
            {errors.stock && (
              <p className="text-red-500 text-xs mt-1">
                {errors.stock.message}
              </p>
            )}
          </div>

          <div>
            <select
              {...register("isAvailable")}
              className="w-full border p-2 rounded border-gray-200"
            >
              <option value="true">Available</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>
        </div>

        <div>
          <textarea
            {...register("description")}
            placeholder="Description"
            className="w-full border p-2 rounded h-24 border-gray-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
