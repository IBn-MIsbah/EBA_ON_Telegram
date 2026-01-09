import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle,
  ShoppingBag,
  User,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Loader2,
  Calendar,
  Hash,
  Wallet,
} from "lucide-react";
import { getOrderById, verifyOrder, rejectOrder } from "@/services/order-api";

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [note, setNote] = useState("");

  const API_URL = "http://localhost:5000";

  const fetchOrderData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await getOrderById(id);
      setOrder(response.data);
      setNote(response.data.adminNotes || "");
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [id]);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending":
      case "awaiting_payment":
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      case "payment_received":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]";
      case "verified":
      case "shipped":
      case "delivered":
        return "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(19,236,55,0.1)]";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const handleStatusUpdate = async (type: "verify" | "reject") => {
    setIsActionLoading(true);
    try {
      if (type === "verify") {
        await verifyOrder(order._id);
      } else {
        await rejectOrder(
          order._id,
          note || "Order does not meet requirements."
        );
      }
      await fetchOrderData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background-dark">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">
          Syncing Data
        </p>
      </div>
    );

  return (
    <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark font-display">
      {/* --- BREADCRUMBS --- */}
      <div className="px-8 pt-6 max-w-7xl mx-auto w-full">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <Link
            to="/orders"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <Hash size={10} /> Ledger
          </Link>
          <ChevronRight size={10} />
          <span className="text-slate-900 dark:text-white">
            Request {order.orderNumber}
          </span>
        </nav>
      </div>

      <div className="px-8 py-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT SIDE: CORE DETAILS (8 cols) --- */}
        <div className="lg:col-span-8 space-y-6">
          {/* RECEIPT HEADER CARD */}
          <section className="bg-white dark:bg-card rounded-[2rem] border border-slate-200 dark:border-border shadow-sm overflow-hidden">
            <div className="px-8 py-8 border-b border-slate-100 dark:border-border flex flex-wrap justify-between items-center gap-6 bg-linear-to-br from-transparent to-primary/5">
              <div className="flex items-center gap-6">
                <div
                  className={`size-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${getStatusStyles(
                    order.status
                  )}`}
                >
                  <ShoppingBag size={32} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
                    Order Detail
                  </h2>
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Hash size={12} /> {order.orderNumber}
                    </span>
                    <span className="opacity-30">|</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Transaction Status
                </span>
                <div
                  className={`px-6 py-2 rounded-xl border-2 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 ${getStatusStyles(
                    order.status
                  )}`}
                >
                  <span
                    className={`size-2 rounded-full bg-current ${
                      order.status !== "cancelled" ? "animate-pulse" : ""
                    }`}
                  />
                  {order.status.replace("_", " ")}
                </div>
              </div>
            </div>

            {/* PRODUCT LIST */}
            <div className="divide-y divide-slate-50 dark:divide-border/50">
              {order.products.map((item: any) => (
                <div
                  key={item._id}
                  className="flex items-center gap-6 p-8 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors"
                >
                  <img
                    src={`${API_URL}${item.productId.imageUrl}`}
                    className="size-20 rounded-2xl object-cover border-2 border-slate-100 dark:border-border shadow-lg"
                    alt={item.productId.name}
                  />
                  <div className="flex-1">
                    <p className="font-black text-lg uppercase tracking-tight dark:text-white">
                      {item.productId.name}
                    </p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                      SKU: {item.productId._id.slice(-6)} • QTY: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                      Unit Price
                    </p>
                    <p className="font-black text-xl text-primary">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL FOOTER */}
            <div className="p-8 bg-slate-50/50 dark:bg-black/40 flex justify-between items-center border-t border-slate-100 dark:border-border">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  Settlement Amount
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-primary">$</span>
                  <span className="text-5xl font-black text-primary tracking-tighter italic">
                    {order.totalAmount}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Wallet size={24} className="opacity-20" />
              </div>
            </div>
          </section>

          {/* PAYMENT PROOF SECTION */}
          <section className="bg-white dark:bg-card rounded-[2rem] border border-slate-200 dark:border-border p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                <ShieldCheck size={20} className="text-primary" /> Verification
                Attachment
              </h3>
              <a
                href={`${API_URL}${order.paymentProof}`}
                target="_blank"
                className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1"
              >
                View Original <ExternalLink size={12} />
              </a>
            </div>
            <div className="rounded-3xl overflow-hidden border-8 border-slate-50 dark:border-background-dark shadow-2xl transition-transform hover:scale-[1.01] duration-500">
              <img
                src={`${API_URL}${order.paymentProof}`}
                className="w-full grayscale-20 hover:grayscale-0 transition-all"
                alt="Payment Proof"
              />
            </div>
          </section>
        </div>

        {/* --- RIGHT SIDE: ACTIONS (4 cols) --- */}
        <div className="lg:col-span-4 space-y-6">
          {/* CUSTOMER CARD */}
          <section className="bg-white dark:bg-card rounded-3xl border border-slate-200 dark:border-border p-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
              Customer Profile
            </h3>
            <div className="flex items-center gap-5 p-4 bg-slate-50 dark:bg-background-dark rounded-2xl border border-slate-100 dark:border-border">
              <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <User size={28} />
              </div>
              <div>
                <p className="text-lg font-black uppercase tracking-tight dark:text-white">
                  {order.phone}
                </p>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                  Account Verified
                </p>
              </div>
            </div>
          </section>

          {/* CONTROL CENTER */}
          <section className="bg-white dark:bg-card rounded-3xl border border-slate-200 dark:border-border p-8 shadow-2xl shadow-primary/5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <AlertTriangle size={20} className="text-amber-500" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest">
                Admin Actions
              </h3>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Internal Feedback / Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type reason for rejection or internal notes here..."
                className="w-full h-40 p-5 text-sm font-bold bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border rounded-2xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none dark:text-white"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleStatusUpdate("verify")}
                disabled={isActionLoading || order.status === "verified"}
                className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#3bf55a] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 shadow-lg shadow-primary/20"
              >
                {isActionLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <CheckCircle size={18} />
                )}
                Approve Order
              </button>

              <button
                onClick={() => handleStatusUpdate("reject")}
                disabled={isActionLoading || order.status === "cancelled"}
                className="w-full flex items-center justify-center gap-3 py-4 border-2 border-red-500/30 text-red-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all disabled:opacity-20"
              >
                {isActionLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <XCircle size={18} />
                )}
                Reject Order
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-border">
              <p className="text-[9px] text-center font-bold text-slate-400 uppercase leading-relaxed tracking-widest opacity-60">
                Authorized Admin only. Actions will trigger automated Telegram
                notifications to the user.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default OrderDetail;
