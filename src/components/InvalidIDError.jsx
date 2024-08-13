import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const InvalidIDError = ({ message = "ID not found" }) => {
  const { User } = useAuth();

  return (
    <>
      {User && <Navigate to="/dashboard" />}
      <div className="absolute text-[--error-color] text-3xl w-full flex justify-center items-center h-full flex-col">
        <h2 className="font-bold">{message}</h2>
        <p>Please ask your teacher to provide with a valid ID.</p>
      </div>
    </>
  );
};

export default InvalidIDError;
