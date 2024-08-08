import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoutes = () => {
  const { User } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!User) {
      navigate("/login");
    }
  }, [User, navigate]);

  if (!User) {
    return null;
  }

  return <Outlet />;
};

export default PrivateRoutes;
