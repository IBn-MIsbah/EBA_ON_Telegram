import React, { useEffect, useState } from "react";
import LoginForm from "../components/form/LoginForm";
import { loginInputSchema, type LoginInput } from "../schemas/auth-schema";
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
    const parseInputData = loginInputSchema.safeParse(data);
    
    if (!parseInputData.success) {
      const validationMsg =
        parseInputData.error.issues[0]?.message || "Invalid input";
      setError(validationMsg);
      setTimeout(() => setError(""), 3000);
      return; // Stop execution here
    }
    try {
      setError("");
      await login(data);

      setMessage("Success! Welcome back.");

      // Delay the navigation
      setTimeout(() => {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }, 1500);
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        const errMessage = err.response?.data.message;
        setError(errMessage);
      } else {
        setError("Invalid email or password.");
      }
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <LoginForm onSubmit={handleLoginSubmit} error={error} message={message} />
    </div>
  );
};
export default Login;
