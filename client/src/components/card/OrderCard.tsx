import React from "react";
import type { Order } from "../../schemas/orderSchema";

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const API_URL = "http://localhost:5000";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6 flex flex-col md:flex-row">
      {/* LEFT SIDE: Order & Products Info */}
      <div className="flex-1 p-6 border-r border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {order.orderNumber}
            </h3>
            <p className="text-xs text-gray-400">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-100 uppercase">
            {order.status.replace("_", " ")}
          </span>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm py-3 px-4 bg-gray-50 rounded-xl">
          <div>
            <span className="text-gray-400 text-xs block">Customer Phone</span>
            <span className="font-semibold text-gray-700">{order.phone}</span>
          </div>
          <div>
            <span className="text-gray-400 text-xs block">Gender / Dept</span>
            <span className="font-semibold text-gray-700">
              {order.userGender}
            </span>
          </div>
        </div>

        {/* Product List Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Ordered Items
          </h4>
          {order.products.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <img
                src={`${API_URL}${item.productId.imageUrl}`}
                alt={item.productId.name}
                className="w-12 h-12 object-cover rounded-lg shadow-sm"
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">
                  {item.productId.name}
                </p>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </span>
                  <span className="text-xs text-gray-500">
                    Price: ${item.price}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 rounded ${
                      item.productId.stock > 0
                        ? "text-green-500 bg-green-50"
                        : "text-red-500 bg-red-50"
                    }`}
                  >
                    Stock: {item.productId.stock}
                  </span>
                </div>
              </div>
              <p className="text-sm font-black text-gray-900">
                ${(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Summary & Actions */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block">Total Amount</span>
            <span className="text-xl font-black text-blue-600">
              ${order.totalAmount}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-6 rounded-xl transition-all shadow-md active:scale-95">
              Approve
            </button>
            <button className="bg-white hover:bg-red-50 text-red-500 text-sm font-bold py-2 px-4 rounded-xl border border-red-100 transition-all">
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Payment Receipt Section */}
      <div className="md:w-72 bg-gray-50 p-6 flex flex-col items-center justify-center">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 self-start">
          Payment Proof
        </h4>
        <div
          className="relative group cursor-zoom-in"
          onClick={() =>
            window.open(`${API_URL}${order.paymentProof}`, "_blank")
          }
        >
          <img
            src={`${API_URL}${order.paymentProof}`}
            alt="Proof"
            className="w-full rounded-xl shadow-lg border border-white transition-transform group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity">
            <span className="text-white text-xs font-bold bg-black/40 px-3 py-1 rounded-full">
              View Large
            </span>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-4 italic text-center leading-relaxed">
          Verify that the amount on the receipt matches the total of{" "}
          <span className="font-bold">${order.totalAmount}</span>
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
