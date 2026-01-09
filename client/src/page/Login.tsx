import React, { useEffect, useState } from "react";
import LoginForm from "../components/form/LoginForm";
import { type LoginInput } from "../schemas/auth-schema";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { AxiosError } from "axios";
import { toast } from "sonner";
// import { Toaster } from "sonner";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLoginSubmit = async (data: LoginInput) => {
    try {
      await login(data);

      toast.success("Login successful!", {
        duration: 3000,
        description: "Welcome back to EBA Admin",
      });

      setTimeout(() => {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }, 1500);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error("Login failed", {
          description: err.response?.data.message || "Invalid credentials",
          duration: 3000,
        });
        return;
      }
      toast.error("Server error", {
        description: "Internal server error! Please contact admin.",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <LoginForm onSubmit={handleLoginSubmit} />
    </>
  );
};

export default Login;
