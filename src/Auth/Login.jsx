import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define validation schema with Zod
const schema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, isAuthenticated } = useAuth();

  // Setup react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleUserLogin = async (data) => {
    try {
      await handleLogin(data.email, data.password);
    } catch (error) {
      // Handled in AuthContext
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard/overview");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] flex flex-col items-center justify-center h-screen z-[3] w-full">
      <form onSubmit={handleSubmit(handleUserLogin)} className="form">
        <h2 className="text-2xl mb-2 text-[--text-color] font-bold text-center">
          Docs Share
        </h2>
        <p className="text-center text-[--text-color]">Login to your account</p>
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={`${
              errors.email ? "border-[--error-color]" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className={`${
              errors.password ? "border-[--error-color]" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
