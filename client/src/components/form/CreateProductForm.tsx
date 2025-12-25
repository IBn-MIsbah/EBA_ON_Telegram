/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";

const CreateProduct: React.FC = () => {
  // 1. State for text inputs
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    isAvailable: "true",
  });

  // 2. State for the image file
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // Local preview
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert("Image is required!");

    setLoading(true);

    // 3. Construct FormData (Required for Multer)
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("isAvailable", formData.isAvailable);
    data.append("image", imageFile); // 'image' matches your Multer upload.single('image')

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/product",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      alert(response.data.message);
      // Reset form on success
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Preview & Input */}
        <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-lg">
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
            required
          />
        </div>

        {/* Text Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            onChange={handleTextChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleTextChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            onChange={handleTextChange}
            className="border p-2 rounded"
            required
          />
          <select
            name="isAvailable"
            onChange={handleTextChange}
            className="border p-2 rounded"
          >
            <option value="true">Available</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleTextChange}
          className="w-full border p-2 rounded h-24"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
