import React from "react";
import LoginForm from "../components/form/LoginForm";
import type { LoginInput } from "../schemas/auth-schema";
import { postLogin } from "../services/auth-api";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const handleLoginSubmit = async (data: LoginInput) => {
    try {
      console.log(data);
      const response = await postLogin(data);

      console.log(response);
      alert("Login success");
      navigate("/");
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
