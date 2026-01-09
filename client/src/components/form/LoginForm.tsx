import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginInputSchema, type LoginInput } from "../../schemas/auth-schema";
import { Lock, UserRound, LogIn, ShieldCheck, Loader2 } from "lucide-react";

interface LoginFormProps {
  onSubmit: (data: LoginInput) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0a0f0b] font-sans text-slate-900 dark:text-white min-h-screen flex items-center justify-center p-6">
      {/* Background decorative blob */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#13ec37]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-white dark:bg-[#111c13] rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden relative backdrop-blur-sm">
        {/* Top brand accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#13ec37] to-[#3bf55a]"></div>

        <div className="p-10">
          {/* Header section */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#13ec37]/20 blur-xl rounded-full"></div>
              <div
                className="relative bg-white dark:bg-slate-900 bg-center bg-no-repeat bg-cover rounded-2xl size-20 shadow-xl ring-1 ring-slate-200 dark:ring-slate-700 p-1"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAA2OunDpn1oiToZeU6cLRXVqU0gO4YyOd-j-6-l-K1QiKCe3IbxFId1St6i__L06jLur3uj_T4Zp4XEuFyQpJM9CbWsv5DZnG9LerMFri9VMiioHs4E3bfhv_YwFU_ZIVRz5OtOfIx_FhvW6JaKDumaVvzClnh4Htn_7AwRZcVWEE7C6OMx3A5ZKT5sJa7qlal8ArimiaWzWvkqVNgz0_9GXOQZuL1tLZACuSuObPKRQhIoF6MnkWzCH03wmBuOrmTBHMZ3MQ0LKJP")',
                }}
              ></div>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
              EBA <span className="text-[#13ec37]">Admin</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Access the management console
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email field */}
            <div className="space-y-2">
              <label
                className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserRound
                    size={18}
                    className="text-slate-400 group-focus-within:text-[#13ec37] transition-colors"
                  />
                </div>
                <input
                  id="email"
                  {...register("email")}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#13ec37] focus:ring-4 focus:ring-[#13ec37]/10 shadow-sm outline-none transition-all"
                  placeholder="admin@eba.store"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs font-bold mt-1.5 ml-1 flex gap-1 items-center">
                  <span className="size-1 bg-red-500 rounded-full"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label
                  className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock
                    size={18}
                    className="text-slate-400 group-focus-within:text-[#13ec37] transition-colors"
                  />
                </div>
                <input
                  id="password"
                  {...register("password")}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#13ec37] focus:ring-4 focus:ring-[#13ec37]/10 shadow-sm outline-none transition-all"
                  placeholder="••••••••"
                  type="password"
                  disabled={isSubmitting}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-bold mt-1.5 ml-1 flex gap-1 items-center">
                  <span className="size-1 bg-red-500 rounded-full"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full flex items-center justify-center gap-3 rounded-xl h-14 bg-[#13ec37] hover:bg-[#11d632] text-black text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-[#13ec37]/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <LogIn size={20} />
              )}
              <span>
                {isSubmitting ? "Authenticating..." : "Sign Into Portal"}
              </span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-slate-50/80 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-[#13ec37]" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            End-to-End Encryption Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
