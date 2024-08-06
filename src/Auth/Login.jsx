import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUserLogin = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Invalid Credentials!");
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard/overview");
    }
  }, [isAuthenticated]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] flex flex-col items-center justify-center h-screen z-[3] w-full">
      <form
        onSubmit={handleUserLogin}
        className="backdrop-blur-md border border-[--text-color] rounded-3xl p-6 shadow-custom"
      >
        <h2 className="text-2xl mb-2 text-[--text-color] font-bold text-center">
          Docs Share
        </h2>
        <p className="text-center text-[--default-text-color]">
          login in to your account
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          name="email"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 p-2 border rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 p-2 border rounded w-full"
          required
        />
        <button
          type="submit"
          className="shadow-custom transition-colors bg-[--secondary-color] text-[--text-color] py-2 rounded w-full font-semibold hover:bg-[--secondary-color-hover]"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
