import React, { createContext, useContext, useState, useEffect } from "react";
import { account } from "../AppwriteConfig";
import Loader from "../components/Loader";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accountDetails = await account.get();
        setIsAuthenticated(accountDetails);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      await account.createEmailPasswordSession(email, password);
      setIsAuthenticated(true);
    } catch (error) {
      setError("Invalid Credentials!");
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const getRole = async () => {
    try {
      const result = await account.get();
      return result.labels[0];
    } catch (error) {
      console.error("Failed to fetch Role:", error);
      return null;
    }
  };

  const contextValue = {
    isAuthenticated,
    loading,
    error,
    handleLogin,
    handleLogout,
    getRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? <Loader isMain={true} /> : children}
    </AuthContext.Provider>
  );
};
