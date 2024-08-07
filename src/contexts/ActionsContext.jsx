import React, { useContext, createContext } from "react";
import {
  account,
  ID,
  databases,
  DATABASE_ID,
  COLLECTION_ID_TEACHERS,
} from "@src/AppwriteConfig.js";
import { toast } from "react-toastify";

// Create the context
const ActionContext = createContext();

// Custom hook to use the ActionContext
const useAction = () => {
  return useContext(ActionContext);
};

const ActionsProvider = ({ children }) => {
  const toastTimer = 3000;
  const createTeacher = async (email, password, username) => {
    const toastId = toast.loading("Creating teacher...");
    try {
      const response = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        response.$id,
        { username, email }
      );
      toast.update(toastId, {
        render: "Teacher created successfully",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (err) {
      console.error("Error creating user:", err);
      toast.update(toastId, {
        render: "Failed to create teacher. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
    }
  };
  const deleteTeacher = async (userId) => {
    const toastId = toast.loading("Deleting teacher...");
    try {
      await account.delete(userId);
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        userId
      );
      toast.update(toastId, {
        render: "Teacher deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.update(toastId, {
        render: "Failed to delete teacher. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
    }
  };
  const listTeachers = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS
      );
      return response.documents;
    } catch (error) {
      console.error("Error listing teachers:", error);
      toast.error("Failed to list teachers. Please try again.", {
        autoClose: toastTimer,
      });
      return [];
    }
  };

  const contextData = {
    createTeacher,
    deleteTeacher,
    listTeachers,
  };

  return (
    <ActionContext.Provider value={contextData}>
      {children}
    </ActionContext.Provider>
  );
};

export { ActionsProvider, useAction };
