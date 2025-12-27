/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProductById, updatedProduct } from "../../services/product-api";
import {
  productUpdateInputSchema,
  type ProductUpdateInput,
  type Product,
} from "../../schemas/productSchema";

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const SERVER_URL = "http://localhost:5000";

  // 1. Initialize Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductUpdateInput>({
    resolver: zodResolver(productUpdateInputSchema) as any,
  });

  // 2. Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await getProductById(id);
        const data: Product = response.data;

        // Populate form with existing data
        reset({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          isAvailable: data.isAvailable,
        });

        // Show current image as preview
        setPreview(`${SERVER_URL}${data.imageUrl}`);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [id, reset]);

  // 3. Handle File Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 4. Submit Update
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

    // Check if a new file was selected
    const fileInput = e.target.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append("image", fileInput.files[0]);
    }

    try {
      await updatedProduct(id, formData as any);
      alert("Product updated successfully!");
      navigate("/"); // Redirect back to list
    } catch (err) {
      console.error("Edit product error: ", err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Section */}
        <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-lg border-gray-200">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded shadow"
            />
          )}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              Change product image (optional)
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500">
              Product Name
            </label>
            <input
              {...register("name")}
              className="w-full border p-2 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">Price ($)</label>
            <input
              type="number"
              {...register("price")}
              className="w-full border p-2 rounded"
            />
            {errors.price && (
              <p className="text-red-500 text-xs">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">
              Stock Quantity
            </label>
            <input
              type="number"
              {...register("stock")}
              className="w-full border p-2 rounded"
            />
            {errors.stock && (
              <p className="text-red-500 text-xs">{errors.stock.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">
              Availability
            </label>
            <select
              {...register("isAvailable")}
              className="w-full border p-2 rounded"
            >
              <option value="true">Available</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500">Description</label>
          <textarea
            {...register("description")}
            className="w-full border p-2 rounded h-32"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
