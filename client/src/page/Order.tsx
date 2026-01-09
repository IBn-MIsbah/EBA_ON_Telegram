import React, { useEffect, useState } from "react";
import type { Order } from "../schemas/orderSchema";
import { getOrders } from "../services/order-api";
import OrderCard from "../components/card/OrderCard";
import { Search, Filter, Download, Inbox } from "lucide-react";

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching Orders: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-12 w-12 border-4 border-slate-200 border-t-[#13ec37] rounded-full animate-spin"></div>
        <p className="font-black uppercase tracking-widest text-xs text-slate-400">
          Loading Orders...
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-10 space-y-8 animate-in fade-in duration-500">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-6xl mx-auto">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Order Management
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-medium">
            Review receipts and fulfill customer requests.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#111c13] border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* --- Filter Bar --- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Order ID or Phone..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#111c13] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-[#13ec37]/20 focus:border-[#13ec37] transition-all text-sm font-medium"
          />
        </div>
        <select className="bg-white dark:bg-[#111c13] border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-sm font-bold outline-none">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Verified</option>
          <option>Rejected</option>
        </select>
        <button className="flex items-center justify-center gap-2 bg-white dark:bg-[#111c13] border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-sm font-bold">
          <Filter size={18} /> More Filters
        </button>
      </div>

      {/* --- Orders List --- */}
      <div className="max-w-6xl mx-auto">
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-[#111c13] border border-slate-200 dark:border-slate-800 rounded-3xl p-20 text-center space-y-4">
            <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Inbox size={32} />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              No orders found for your department.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((item) => (
              <OrderCard key={item._id} order={item} onUpdate={fetchOrders} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
