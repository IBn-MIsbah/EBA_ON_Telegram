import React, { useEffect, useState } from "react";
import type { Order } from "../schemas/orderSchema";
import { getOrders } from "../services/order-api";
import OrderCard from "../components/card/OrderCard";

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        console.log(response.data);
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching Orders: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 animate-pulse font-medium">
        Fetching Orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Order Management
          </h1>
          <p className="mt-2 text-gray-600">
            Review receipts and fulfill pending customer requests.
          </p>
        </header>

        {orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-20 text-center">
            <p className="text-gray-400 text-lg">
              No orders found for your department.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((item) => (
              <OrderCard key={item._id} order={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
