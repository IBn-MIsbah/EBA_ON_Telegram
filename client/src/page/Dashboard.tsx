/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import ListProducts from "../components/form/ListProducts";
import { getMe } from "../services/auth-api";
import type { Me } from "../schemas/auth-schema";

export type User = Me["data"];

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User>();
  const navigate = useNavigate(); // 2. Initialize navigate

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await getMe();
        setUser(response.data);
      } catch (err: any) {
        console.error("Error fetchMe: ", err);

        // 3. Check if the error status is 401 (Unauthorized)
        if (err.response?.status === 401) {
          navigate("/login"); // Redirect to login page
        }
      }
    };
    fetchMe();
  }, [navigate]);

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
