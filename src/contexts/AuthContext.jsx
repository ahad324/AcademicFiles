import React, { createContext, useContext, useState, useEffect } from "react";
import { account } from "../AppwriteConfig";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const toastTimer = 3000;
  const [User, setUser] = useState(false);
  const [isAdmin, setisAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accountDetails = await account.get();
        setUser(accountDetails);
        CheckAdmin();
      } catch (error) {
        setUser(false);
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
      setUser(true);
      toast.update(toastId, {
        render: "Logged in successfully!",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: "Invalid Credentials.",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
    }
  };
  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(false);
      toast.info("Logged out successfully!", { autoClose: toastTimer });
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to log out!", { autoClose: toastTimer });
    }
  };

  const CheckAdmin = async () => {
    try {
      const result = await account.getPrefs();
      setisAdmin(Object.keys(result).length === 1);
    } catch (error) {
      console.error("Failed to fetch Role:", error);
      toast.error("Failed to fetch role!", { autoClose: toastTimer });
      return null;
    }
  };

  const contextValue = {
    User,
    loading,
    handleLogin,
    handleLogout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? <Loader isMain={true} /> : children}
    </AuthContext.Provider>
  );
};
