/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ListProducts from "../components/form/ListProducts";
import type { Me } from "../schemas/auth-schema";
import { useAuth } from "../context/auth-context";

export type User = Me["data"];

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Optional: Don't render dashboard content if user isn't loaded yet
  if (!user) {
    return <div className="p-10 text-center">Loading Dashboard...</div>;
  }

  return (
    <div>
      <div className="p-4 bg-gray-100 font-bold">
        Welcome to Dashboard, {user.name || "User"}
      </div>
      <div>
        <ListProducts />
      </div>
    </div>
  );
};

export default Dashboard;
