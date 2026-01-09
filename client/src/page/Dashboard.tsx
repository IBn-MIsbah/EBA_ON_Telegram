import React from "react";
import ListProducts from "../components/form/ListProducts";
import { useAuth } from "../context/auth-context";
import { PlusCircle, ShoppingBag, DollarSign, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null; // MainLayout handles the loading state

  return (
    <div className="p-5 md:p-10 space-y-8 animate-in fade-in duration-500">
      {/* --- Header Section --- */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Overview
        </h2>
        <p className="text-sm md:text-base text-slate-500 font-medium">
          Welcome back, {user.name}
        </p>
      </div>

      {/* --- Stats: Horizontal Scroll on Mobile, Grid on Desktop --- */}
      <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto pb-4 md:pb-0 snap-x no-scrollbar">
        <StatCard
          label="Revenue"
          value="$4,250"
          trend="+12% this month"
          icon={<DollarSign size={18} />}
          color="green"
        />
        <StatCard
          label="Active Orders"
          value="14"
          trend="+3 new"
          icon={<ShoppingBag size={18} />}
          color="green"
        />
        <StatCard
          label="Low Stock"
          value="02"
          trend="Requires Action"
          icon={<AlertCircle size={18} />}
          color="red"
        />
      </div>

      {/* --- Inventory Section --- */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Inventory
          </h3>
          <Link
            to="/create-product"
            className="group p-2 bg-[#13ec37] text-black rounded-xl shadow-lg shadow-[#13ec37]/20 md:px-5 md:py-2.5 md:text-sm font-bold flex items-center gap-2 transition-all active:scale-95 hover:bg-[#11d632]"
          >
            <PlusCircle
              size={20}
              className="group-hover:rotate-90 transition-transform"
            />
            <span className="hidden md:inline">Add Product</span>
          </Link>
        </div>

        {/* The component that fetches and maps your products */}
        <ListProducts />
      </div>
    </div>
  );
};

/* --- Local Sub-Component for Stats --- */
interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: "green" | "red";
}

const StatCard = ({ label, value, trend, icon, color }: StatCardProps) => (
  <div className="min-w-[200px] flex-1 snap-start bg-white dark:bg-[#111c13] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <div
        className={`p-2 rounded-lg ${
          color === "red"
            ? "bg-red-50 text-red-500"
            : "bg-[#13ec37]/10 text-[#13ec37]"
        }`}
      >
        {icon}
      </div>
    </div>
    <div className="flex flex-col">
      <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none">
        {value}
      </h4>
      <span
        className={`text-[10px] font-bold mt-2 flex items-center gap-1 ${
          color === "red" ? "text-red-500" : "text-[#13ec37]"
        }`}
      >
        <span
          className={`size-1 rounded-full ${
            color === "red" ? "bg-red-500" : "bg-[#13ec37]"
          }`}
        />
        {trend}
      </span>
    </div>
  </div>
);

export default Dashboard;
