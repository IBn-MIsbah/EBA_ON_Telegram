import React, { useState, type ChangeEvent, type FormEvent } from "react";
import type { LoginInput } from "../../schemas/auth-schema";

interface LoginFormProps {
  onSubmit: (data: LoginInput) => void;
}
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      id="LoginForm"
      className="w-72 h-72 flex flex-col rounded-lg shadow bg-slate-50 p-4"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col p-4">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          className="border"
          value={formData.email}
          onChange={handleOnChange}
        />
      </div>
      <div className="flex flex-col p-4">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          className="border"
          value={formData.password}
          onChange={handleOnChange}
        />
      </div>
      <button type="submit" className="border">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
