import React, { useState, type ChangeEvent, type FormEvent } from "react";
import type { LoginInput } from "../../schemas/auth-schema";
import Master from "../images/Master.svg";

interface LoginFormProps {
  message?: string;
  error?: string;
  onSubmit: (data: LoginInput) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, message, error }) => {
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message) { // Prevent multiple submits if success message is showing
      onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-100/50">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
        
        {/* LEFT SIDE */}
        <div className="md:w-1/2 p-8 flex flex-col items-center justify-center bg-gray-50 border-r border-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-2 text-blue-600 tracking-tight">EBA</h1>
            <p className="text-blue-500 italic font-medium">Please Log-in to Continue</p>
          </div>

          <div className="mt-10 hidden md:flex justify-center w-full">
            <img
              src={Master}
              alt="Store Illustration"
              className="rounded-lg mix-blend-multiply opacity-90 transition-all duration-500 ease-in-out w-64 lg:w-80 h-auto"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 p-8 flex items-center justify-center bg-white">
          <form className="w-full max-w-xs flex flex-col gap-4" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Login</h2>
            
            {/* Status Messages - Dynamic Height */}
            <div className="min-h-10"> 
              {error && (
                <div className="rounded-lg border border-red-400 bg-red-50 text-red-800 text-sm font-semibold p-2 text-center animate-pulse">
                  {error}
                </div>
              )}
              {message && (
                <div className="rounded-lg border border-green-400 bg-green-50 text-green-800 text-sm font-semibold p-2 text-center">
                  {message}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email" // Added ID
                name="email"
                required
                placeholder="name@company.com"
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={formData.email}
                onChange={handleOnChange}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password" // Added ID
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={formData.password}
                onChange={handleOnChange}
              />
            </div>

            <button
              type="submit"
              disabled={!!message} // Disable button during success redirect
              className={`font-bold py-2 rounded-md transition mt-2 shadow-lg active:scale-95 ${
                message ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {message ? "Redirecting..." : "Login Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;