import React, { useEffect } from "react";
import LoginForm from "../components/form/LoginForm";
import type { LoginInput } from "../schemas/auth-schema";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location, user]);

  const handleLoginSubmit = async (data: LoginInput) => {
    try {
      await login(data);
      alert("Login successful!");
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };
  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <LoginForm onSubmit={handleLoginSubmit} />
    </div>
  );
};

export default Login;
