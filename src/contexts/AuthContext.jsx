import React, { createContext, useContext, useState, useEffect } from "react";
import {
  account,
  databases,
  DATABASE_ID,
  COLLECTION_ID_TEACHERS,
} from "../AppwriteConfig";
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

  const getUserPassword = async (documentId) => {
    try {
      const result = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        documentId
      );
      let pass = result.password;
      return pass;
    } catch (error) {
      console.error("failed to get Password");
      return;
    }
  };

  const updatePassword = async (documentId, password) => {
    const toastId = toast.loading("Updating password...");
    try {
      const result = await account.updatePassword(
        password,
        await getUserPassword(documentId)
      );

      const res = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        documentId,
        { password: password }
      );
      toast.update(toastId, {
        render: "Password updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (error) {
      console.error("Failed to update password:", error);
      toast.update(toastId, {
        render: "Failed to update password!",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
    }
  };
  const updateEmail = async (documentId, email) => {
    const toastId = toast.loading("Updating email...");
    try {
      await account.updateEmail(email, await getUserPassword(documentId));
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        documentId,
        { email: email }
      );
      toast.update(toastId, {
        render: "Email updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (error) {
      console.error("Failed to update email:", error);
      toast.update(toastId, {
        render: "Failed to update email!",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
    }
  };
  const updateUsername = async (documentId, name) => {
    const toastId = toast.loading("Updating username...");
    try {
      await account.updateName(name);
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        documentId,
        { username: name }
      );
      toast.update(toastId, {
        render: "Username updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (error) {
      console.error("Failed to update username:", error);
      toast.update(toastId, {
        render: "Failed to update username!",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
    }
  };
  const blockAccount = async () => {
    const toastId = toast.loading("Blocking account...");
    try {
      const result = await account.updateStatus();
      toast.update(toastId, {
        render: "Account blocked successfully!",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (error) {
      console.error("Failed to block account:", error);
      toast.update(toastId, {
        render: "Failed to block account!",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
    }
  };

  const contextValue = {
    toastTimer,
    User,
    handleLogin,
    handleLogout,
    isAdmin,
    updatePassword,
    updateEmail,
    updateUsername,
    blockAccount,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? <Loader isMain={true} /> : children}
    </AuthContext.Provider>
  );
};
