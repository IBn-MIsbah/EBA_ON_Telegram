import React from "react";
import ListProducts from "../components/form/ListProducts";
import { useAuth } from "../context/auth-context";
import { PlusCircle, ShoppingBag, DollarSign, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-5 md:p-10 space-y-10 animate-in fade-in duration-500">
      {/* --- Header Section --- */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">
          Overview
        </h2>
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[#13ec37] animate-pulse" />
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500">
            Authenticated: {user.name}
          </p>
        </div>
      </div>

      {/* --- Stats Grid --- */}
      {/* <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-4 md:pb-0 snap-x no-scrollbar">
        <StatCard
          label="Total Revenue"
          value="--" // Replace with data.revenue
          trend="Live_Sync"
          icon={<DollarSign size={18} />}
          color="green"
        />
        <StatCard
          label="Active Orders"
          value="--" // Replace with data.orderCount
          trend="0_Pending"
          icon={<ShoppingBag size={18} />}
          color="green"
        />
        <StatCard
          label="Low Stock"
          value="--" // Replace with data.lowStockCount
          trend="System_Alert"
          icon={<AlertCircle size={18} />}
          color="red"
        />
      </div> */}

      {/* --- Inventory Section --- */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">
              Inventory Registry
            </h3>
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Manage_Products
            </p>
          </div>
          <Link
            to="/create-product"
            className="group px-5 py-2.5 bg-[#13ec37] text-black rounded-xl shadow-lg shadow-[#13ec37]/20 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 hover:bg-[#11d632]"
          >
            <PlusCircle
              size={18}
              strokeWidth={3}
              className="group-hover:rotate-90 transition-transform"
            />
            Add Product
          </Link>
        </div>

        <ListProducts />
      </div>
    </div>
  );
};

/* --- StatCard Component --- */
interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
  color: "green" | "red";
}

const StatCard = ({ label, value, trend, icon, color }: StatCardProps) => (
  <div className="min-w-[240px] flex-1 snap-start bg-white dark:bg-[#111c13] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-[#13ec37]/30 group">
    <div className="flex justify-between items-start mb-6">
      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <div
        className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${
          color === "red"
            ? "bg-red-500/10 text-red-500 border border-red-500/20"
            : "bg-[#13ec37]/10 text-[#13ec37] border border-[#13ec37]/20"
        }`}
      >
        {icon}
      </div>
    </div>
    <div className="flex flex-col">
      <h4 className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
        {value}
      </h4>
      <span
        className={`text-[9px] font-mono font-bold mt-4 flex items-center gap-2 uppercase tracking-widest ${
          color === "red" ? "text-red-500" : "text-[#13ec37]"
        }`}
      >
        <span
          className={`size-1.5 rounded-full ${
            color === "red" ? "bg-red-500 animate-pulse" : "bg-[#13ec37]"
          }`}
        />
        {trend}
      </span>
    </div>
  </div>
);

export default Dashboard;
