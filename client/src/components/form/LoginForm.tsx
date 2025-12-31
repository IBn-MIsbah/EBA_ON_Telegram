import React, { useState, type ChangeEvent, type FormEvent } from "react";
import type { LoginInput } from "../../schemas/auth-schema";
import Master from "../images/Master.svg";
import Greeting from "../images/signup.svg";

interface LoginFormProps {
  onSubmit: (data: LoginInput) => void;
}
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        {/* Main Container */}
        <div className="flex flex-col md:flex-row bg-white  rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
          {/* LEFT SIDE*/}
          <div className="md:w-1/2 p-8 flex flex-col items-center justify-center bg-gray-50 border-r border-gray-100">
            {/* Div 1: Heading & Text - Centered */}
            <div className="text-center">
              <h1 className="text-4xl font-extrabold mb-2 text-blue-600 tracking-tight">
                EBA
              </h1>
              <p className="text-blue-500 italic font-medium">
                Please Log-in to Continue
              </p>
            </div>

            {/* Div 2: Image / SVG - Centered and Responsive */}
            <div className="mt-10 hidden   md:flex justify-chidden enter w-full">
              <img
                src={Greeting}
                alt="Store Illustration"
                className="
        rounded-lg mix-blend-multiply opacity-90 
        transition-all duration-500 ease-in-out
        /* Responsive Widths */
        w-45        /* Mobile (default) */
        sm:w-55      /* Small screens */
        md:w-70     /* Medium screens */
        lg:w-87.5     /* Large screens */
        h-auto            /* Keep aspect ratio */
      "
              />
            </div>
          </div>

          {/* RIGHT SIDE: The Form Container */}
          <div className="md:w-1/2 p-8 flex items-center justify-center bg-white">
            <form
              id="LoginForm"
              className="w-full max-w-xs flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Login
              </h2>

              {/* Email Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.email}
                  onChange={handleOnChange}
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.password}
                  onChange={handleOnChange}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition mt-2 shadow-lg active:scale-95"
              >
                Login Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
