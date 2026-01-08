import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type UpdateUserBody,
  updateUserSchema,
  type User,
} from "../schemas/auth-schema";
import { patchData } from "../services/auth-api";

interface SettingsPageProps {
  currentUser: User | null;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateUserBody>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      gender: "MALE",
      bank: "",
      accNO: "",
      accHolderName: "",
      password: "", // Always empty by default
    },
  });

  // Sync data when currentUser is loaded
  useEffect(() => {
    if (currentUser) {
      reset({
        ...currentUser,
        password: "", // Ensure password stays empty even on reset
      });
    }
  }, [currentUser, reset]);

  const onSubmit = async (data: UpdateUserBody) => {
    try {
      const payload = { ...data };
      // Remove password if it was left empty to avoid hashing an empty string
      if (!payload.password || payload.password === "") {
        delete payload.password;
      }

      if (currentUser?._id) {
        await patchData(currentUser._id, payload);
        alert("Profile updated successfully!");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Account Settings
      </h2>
      <p className="text-gray-500 mb-8 text-sm">
        Update your profile information and banking details.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <input
              {...register("name")}
              className={`p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              {...register("email")}
              className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Phone Number
            </label>
            <input
              {...register("phone")}
              className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Gender
            </label>
            <select
              {...register("gender")}
              className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
        </div>

        {/* Admin only field: Role */}
        {currentUser?.role === "ADMIN" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              User Role (Admin Only)
            </label>
            <select
              {...register("role")}
              className="p-2.5 border border-blue-200 bg-blue-50 rounded-lg outline-none"
            >
              <option value="USER">User</option>
              <option value="AMIR">Amir</option>
              <option value="VICEAMIR">Vice Amir</option>
              <option value="AMIRA">Amira</option>
              <option value="VICEAMIRA">Vice Amira</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        )}

        <div className="pt-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
            Banking Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Bank Name
              </label>
              <input
                {...register("bank")}
                className="p-2.5 border border-gray-300 rounded-lg outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Account Number
              </label>
              <input
                {...register("accNO")}
                className="p-2.5 border border-gray-300 rounded-lg outline-none"
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Account Holder Name
              </label>
              <input
                {...register("accHolderName")}
                className="p-2.5 border border-gray-300 rounded-lg outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
            Security
          </h3>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              New Password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              {...register("password")}
              placeholder="Leave blank to keep current password"
              className="p-2.5 border border-gray-300 rounded-lg outline-none"
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
        >
          {isSubmitting ? "Processing..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
