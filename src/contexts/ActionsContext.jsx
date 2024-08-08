import React, { useContext, createContext, useState } from "react";
import {
  account,
  avatars,
  ID,
  databases,
  DATABASE_ID,
  COLLECTION_ID_TEACHERS,
  Query,
} from "@src/AppwriteConfig.js";
import { toast } from "react-toastify";
import { useData } from "./DataContext";

// Create the context
const ActionContext = createContext();

// Custom hook to use the ActionContext
const useAction = () => {
  return useContext(ActionContext);
};

const ActionsProvider = ({ children }) => {
  const { toastTimer } = useData();
  const [teachers, setTeachers] = useState([]);
  const [teacherImages, setTeacherImages] = useState({});
  const [urlsByTeacher, setUrlsByTeacher] = useState({});
  const DomainURL = "https://academicfilerelay.netlify.app/";

  const getProfileImage = async (initials) => {
    try {
      const avatarURL = avatars.getInitials(initials);
      return avatarURL.href;
    } catch (error) {
      console.error("Error getting profile image:", error);
      return "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";
    }
  };

  const createTeacher = async (email, password, username) => {
    const toastId = toast.loading("Creating teacher...");
    try {
      const TeacherID = ID.unique();
      await account.create(TeacherID, email, password, username);
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        TeacherID,
        { TeacherID, username, email, password }
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

  const listTeachers = async () => {
    const toastId = toast.loading("Fecthing teachers...");
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS
      );
      const teacherList = response.documents;
      setTeachers(teacherList);

      // Fetch and set images
      const images = {};
      for (const teacher of teacherList) {
        const imageUrl = await getProfileImage(teacher.username);
        images[teacher.TeacherID] = imageUrl;
      }
      setTeacherImages(images);
      toast.update(toastId, {
        render: "",
        type: "success",
        isLoading: false,
        autoClose: 1,
      });
      return teacherList;
    } catch (error) {
      console.error("Error listing teachers:", error);
      toast.error("Failed to list teachers. Please try again.", {
        autoClose: toastTimer,
      });
      return [];
    }
  };

  const getURLsByTeacher = async (teacherId) => {
    const toastId = toast.loading("Fecthing URLs...");
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        [Query.equal("TeacherID", teacherId)]
      );
      toast.update(toastId, {
        render: "",
        type: "success",
        isLoading: false,
        autoClose: 1,
      });
      const document = response.documents[0];
      if (document) {
        const urls = document.urls || [];
        setUrlsByTeacher((prev) => ({ ...prev, [teacherId]: urls }));
        return urls;
      }
    } catch (err) {
      console.error("Error fetching URLs by teacher:", err);
      toast.error("Failed to fetch URLs. Please try again.");
      return [];
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Link Copied to clipboard.", { autoClose: toastTimer });
  };

  // Function to create URL and save it to the teacher's document
  const createURL = async (urlID) => {
    const toastId = toast.loading("Creating URL...");
    try {
      const user = await account.get(); // Get the currently logged-in user's account
      let teacherID = user.$id;

      // Fetch the teacher's document
      let document;
      try {
        document = await databases.getDocument(
          DATABASE_ID,
          COLLECTION_ID_TEACHERS,
          teacherID
        );
      } catch (err) {
        // Create a document for anonymous user if not found
        if (err.code === 404) {
          await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID_TEACHERS,
            teacherID,
            {
              TeacherID: teacherID,
              username: "Anonymous",
              email: "Anonymous@mail.com",
              urls: [],
            }
          );
          document = { urls: [] };
        } else {
          throw err;
        }
      }

      // Update the URLs array
      const currentURLs = document.urls || [];
      const updatedURLs = [...currentURLs, urlID];
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        teacherID,
        { urls: updatedURLs }
      );

      toast.update(toastId, {
        render: "URL created successfully",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (err) {
      console.error("Error creating URL:", err);
      toast.update(toastId, {
        render: "Failed to create URL. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
    }
  };

  const deleteURL = async (documentID, urlID) => {
    const toastId = toast.loading("Deleting URL...");
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        documentID
      );

      const currentURLs = document.urls || [];
      const updatedURLs = currentURLs.filter((url) => url !== urlID);

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        documentID,
        { urls: updatedURLs }
      );

      // Update URLs by teacher after deletion
      setUrlsByTeacher((prev) => ({
        ...prev,
        [documentID]: updatedURLs,
      }));
      toast.update(toastId, {
        render: "",
        type: "success",
        isLoading: false,
        autoClose: 1,
      });
    } catch (error) {
      console.error("Error deleting URL:", error);
      toast.error("Failed to delete URL. Please try again.");
    }
  };

  const contextData = {
    teachers,
    teacherImages,
    createTeacher,
    listTeachers,
    getProfileImage,
    getURLsByTeacher,
    copyToClipboard,
    deleteURL,
    DomainURL,
    urlsByTeacher,
    createURL,
    toastTimer,
  };

  return (
    <ActionContext.Provider value={contextData}>
      {children}
    </ActionContext.Provider>
  );
};

export { ActionsProvider, useAction };
