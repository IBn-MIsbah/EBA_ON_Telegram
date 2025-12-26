import React from "react";
import type { LoginInput } from "../../schemas/auth-schema";
import { postLogin } from "../../services/auth-api";
import LoginForm from "../form/LoginForm";

const Login: React.FC = () => {
  const handleLoginSubmit = async (data: LoginInput) => {
    try {
      console.log(data);
      const response = await postLogin(data);
      console.log(response);
      alert("Login success");
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
