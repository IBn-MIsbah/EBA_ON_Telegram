import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginInputSchema, type LoginInput } from "../../schemas/auth-schema";

import Master from "../images/Master.svg";
import Reload from "@/components/Loading/Reloading";

interface LoginFormProps {
  message?: string;
  error?: string;
  onSubmit: (data: LoginInput) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, message, error }) => {
  // 1. Initialize useForm with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    mode: "onTouched",
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-100/50">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
        {/* LEFT SIDE */}
        <div className="md:w-1/2 p-8 flex flex-col items-center justify-center bg-gray-50 border-r border-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-2 text-blue-600 tracking-tight">
              EBA
            </h1>
            <p className="text-blue-500 italic font-medium">
              Please Log-in to Continue
            </p>
          </div>
          <div className="mt-10 hidden md:flex justify-center w-full">
            <img
              src={Master}
              alt="Illustration"
              className="w-64 lg:w-80 h-auto mix-blend-multiply opacity-90"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 p-8 flex items-center justify-center bg-white">
          <form
            className="w-full max-w-xs flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)} // RHF handles the event and validation
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Login</h2>

            {/* Global Status Messages (API Errors) */}
            <div className="min-h-10">
              {error && (
                <div className="rounded-lg border border-red-400 bg-red-50 text-red-800 text-xs font-semibold p-2 text-center animate-pulse">
                  {error}
                </div>
              )}
              {message && (
                <div className="rounded-lg border border-green-400 bg-green-50 text-green-800 text-xs font-semibold p-2 text-center">
                  {message}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                {...register("email")} // Replaces value and onChange
                className={`border rounded-md p-2 outline-none transition focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="name@company.com"
              />
              {/* Individual Field Error */}
              {errors.email && (
                <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={`border rounded-md p-2 outline-none transition focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !!message}
              className={`flex items-center justify-center gap-2 font-bold py-2 rounded-md transition mt-2 shadow-lg active:scale-95 ${
                isSubmitting || message
                  ? "bg-gray-400 cursor-not-allowed text-gray-700"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSubmitting ? (
                /* This wrapper ensures the spinner has its own space */
                <div className="flex items-center justify-center">
                  <Reload />
                </div>
              ) : message ? (
                "Redirecting..."
              ) : (
                "Login Now"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
