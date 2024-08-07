import React, { createContext, useContext, useState, useEffect } from "react";
import { account } from "../AppwriteConfig";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const toastTimer = 3000;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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
    const toastId = toast.loading("Logging in...");
    try {
      await account.createEmailPasswordSession(email, password);
      setIsAuthenticated(true);
      toast.update(toastId, {
        render: "Logged in successfully!",
        type: "success",
        isLoading: false,
        autoClose: toastTimer, // Close after 3 seconds
      });
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: "Invalid Credentials.",
        type: "error",
        isLoading: false,
        autoClose: toastTimer, // Close after 3 seconds
      });
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setIsAuthenticated(false);
      toast.info("Logged out successfully!", { autoClose: toastTimer }); // Close after 3 seconds
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to log out!", { autoClose: toastTimer }); // Close after 3 seconds
    }
  };

  const getRole = async () => {
    try {
      const result = await account.get();
      return result.labels[0];
    } catch (error) {
      console.error("Failed to fetch Role:", error);
      toast.error("Failed to fetch role!", { autoClose: toastTimer }); // Close after 3 seconds
      return null;
    }
  };

  const contextValue = {
    isAuthenticated,
    loading,
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
