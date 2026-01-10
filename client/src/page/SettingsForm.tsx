import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  CreditCard,
  Save,
  ChevronDown,
} from "lucide-react";
import {
  type UpdateUserBody,
  updateUserSchema,
  type User,
} from "../schemas/auth-schema";
import { patchData } from "../services/auth-api";
import { toast } from "sonner";

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
      password: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      reset({
        ...currentUser,
        password: "",
      });
    }
  }, [currentUser, reset]);

  const onSubmit = async (data: UpdateUserBody) => {
    try {
      const payload = { ...data };
      if (!payload.password || payload.password === "") {
        delete payload.password;
      }

      if (currentUser?._id) {
        await patchData(currentUser._id, payload);
        toast.success("Settings updated successfully!", {
          duration: 3000,
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed", {
        duration: 3000,
      });
    }
  };

  return (
    <div className="p-5 md:p-10 animate-in fade-in duration-500">
      <header className="max-w-4xl mx-auto w-full mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Settings
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Manage your account configuration and preferences.
          </p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isDirty}
          className="flex items-center gap-2 px-8 py-3 bg-[#13ec37] text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#11d632] shadow-lg shadow-[#13ec37]/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
        >
          <Save size={18} />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto space-y-10 pb-20"
      >
        {/* --- Section 1: Store/Profile Info --- */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-400">
            <UserIcon size={16} className="text-[#13ec37]" /> Profile
            Information
          </h3>
          <div className="bg-white dark:bg-[#111c13] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    {...register("name")}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-bold"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    {...register("email")}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    {...register("phone")}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                  Gender
                </label>
                <div className="relative">
                  <select
                    {...register("gender")}
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Section 2: Banking --- */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-400">
            <CreditCard size={16} className="text-[#13ec37]" /> Banking Details
          </h3>
          <div className="bg-white dark:bg-[#111c13] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                  Bank Name
                </label>
                <input
                  {...register("bank")}
                  placeholder="e.g. Chase Bank"
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                  Account Number
                </label>
                <input
                  {...register("accNO")}
                  placeholder="0000 0000 0000"
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-bold"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                  Account Holder Name
                </label>
                <input
                  {...register("accHolderName")}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-bold"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- Section 3: Security --- */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-400">
            <ShieldCheck size={16} className="text-[#13ec37]" /> Security
          </h3>
          <div className="bg-white dark:bg-[#111c13] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                Update Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="Leave blank to keep current password"
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-[#13ec37] transition-all font-bold"
              />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ml-1">
                Min. 8 characters with a mix of letters and numbers
              </p>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default SettingsPage;
