import React, { useState } from "react";
import type { Order } from "../../schemas/orderSchema";
import { rejectOrder, verifyOrder } from "../../services/order-api";
import {
  CheckCircle,
  XCircle,
  Eye,
  Package,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

interface OrderCardProps {
  order: Order;
  onUpdate: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdate }) => {
  const API_URL = "http://localhost:5000";
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Status Color Logic based on your 7-stage lifecycle
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "awaiting_payment":
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
      case "payment_received":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "verified":
      case "shipped":
      case "delivered":
        return "text-[#13ec37] bg-[#13ec37]/10 border-[#13ec37]/20";
      case "cancelled":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-slate-400 bg-slate-400/10";
    }
  };

  const handleVerify = async (orderId: string) => {
    setIsProcessing(true);
    try {
      const response = await verifyOrder(orderId);
      if (response.success) onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (orderId: string) => {
    setIsProcessing(true);
    try {
      // Direct rejection with default message since we are removing window.prompt
      const response = await rejectOrder(orderId, "Order rejected by admin");
      if (response.success) onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const statusStyles = getStatusColor(order.status);

  return (
    <div className="bg-white dark:bg-[#111c13] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row items-center transition-all hover:border-[#13ec37]/30 group relative">
      {/* 1. STATUS & ID */}
      <Link
        to={`/orders/${order._id}`}
        className="p-4 md:p-6 flex items-center gap-4 w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group/link"
      >
        <div
          className={`size-10 rounded-xl flex items-center justify-center shrink-0 border ${statusStyles}`}
        >
          <Package size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-black tracking-tight uppercase group-hover/link:text-primary transition-colors">
              {order.orderNumber}
            </h3>
            <ArrowUpRight
              size={12}
              className="opacity-0 group-hover/link:opacity-100 transition-opacity text-primary"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
            <span
              className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${statusStyles}`}
            >
              {order.status.replace("_", " ")}
            </span>
          </div>
        </div>
      </Link>

      {/* 2. COMPACT ITEMS */}
      <Link
        to={`/orders/${order._id}`}
        className="flex-1 p-4 flex items-center gap-4 overflow-hidden hover:opacity-80 transition-opacity"
      >
        <div className="flex -space-x-3 overflow-hidden">
          {order.products.slice(0, 4).map((item) => (
            <img
              key={item._id}
              src={`${API_URL}${item.productId.imageUrl}`}
              className="size-10 rounded-xl object-cover border-2 border-white dark:border-[#111c13] shadow-md"
              alt="product"
            />
          ))}
          {order.products.length > 4 && (
            <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-[#111c13] flex items-center justify-center text-[10px] font-black text-slate-500">
              +{order.products.length - 4}
            </div>
          )}
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {order.products.length}{" "}
          {order.products.length === 1 ? "Item" : "Items"}
        </p>
      </Link>

      {/* 3. TOTAL */}
      <div className="px-6 py-4 flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
        <div className="text-left md:text-right min-w-24">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Amount
          </p>
          <p className="text-xl font-black text-primary">
            ${order.totalAmount}
          </p>
        </div>
      </div>

      {/* 4. QUICK ACTIONS */}
      <div className="p-4 bg-slate-50 dark:bg-black/20 w-full md:w-auto flex items-center justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800">
        <button
          onClick={() =>
            window.open(`${API_URL}${order.paymentProof}`, "_blank")
          }
          title="View Proof"
          className="p-2.5 text-slate-400 hover:text-primary transition-all bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <Eye size={18} />
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block"></div>

        <div className="flex items-center gap-2">
          {/* Reject Button (Only shows if not already cancelled) */}
          {order.status !== "cancelled" && order.status !== "verified" && (
            <button
              onClick={() => handleReject(order._id)}
              disabled={isProcessing}
              className="p-2.5 text-red-500 hover:bg-red-500 hover:text-white transition-all bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900/30 shadow-sm disabled:opacity-30"
            >
              <XCircle size={18} />
            </button>
          )}

          {/* Approve Button (Only shows if not already verified) */}
          {order.status !== "verified" && (
            <button
              onClick={() => handleVerify(order._id)}
              disabled={isProcessing || order.status === "cancelled"}
              className="px-5 py-2.5 bg-primary text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#11d632] transition-all shadow-lg shadow-primary/20 disabled:opacity-30 flex items-center gap-2"
            >
              {isProcessing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CheckCircle size={14} />
              )}
              Approve
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
