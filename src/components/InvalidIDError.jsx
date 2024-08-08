import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const InvalidIDError = ({ message = "ID not found" }) => {
  const { User } = useAuth();

  return (
    <>
      {User && <Navigate to="/dashboard" />}
      <div>{message}</div>
    </>
  );
};

export default InvalidIDError;
