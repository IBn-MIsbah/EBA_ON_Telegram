import React, { useEffect, useState } from "react";
import LoginForm from "../components/form/LoginForm";
import { type LoginInput } from "../schemas/auth-schema";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { AxiosError } from "axios";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated && message === "") {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location, message]);

  const handleLoginSubmit = async (data: LoginInput) => {
    try {
      setError("");
      setMessage("");
      await login(data);

      setMessage("Success! Welcome back.");

      // Delay the navigation
      setTimeout(() => {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }, 1500);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message || "Login failed");
        return;
      }
      setError("Internal server Error! Please contact Admin!");
    }
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <LoginForm onSubmit={handleLoginSubmit} error={error} message={message} />
    </div>
  );
};
export default Login;
