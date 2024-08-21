import React, { useContext, createContext, useState, useEffect } from "react";
import {
  client,
  account,
  ID,
  databases,
  DATABASE_ID,
  COLLECTION_ID_TEACHERS,
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
  const {
    toastTimer,
    getProfileImage,
    handleFileDelete,
    getUserID,
    checkIDInDatabase,
    DomainURL,
    setFilesByUrl,
    filesByUrl,
  } = useData();
  const [teachers, setTeachers] = useState([]);
  const [teacherImages, setTeacherImages] = useState({});
  const [urlsByTeacher, setUrlsByTeacher] = useState({});

  const fetchURLS = async () => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS
      );
      const teacherList = res.documents;

      // Set initial URLs by teacher
      const urlsMap = {};
      const images = {};
      teacherList.forEach((teacher) => {
        urlsMap[teacher.TeacherID] = teacher.urls || [];
        // Fetch and set images
        getProfileImage(teacher.username).then((imageUrl) => {
          images[teacher.TeacherID] = imageUrl;
          setTeacherImages(images);
        });
      });
      setTeachers(teacherList);
      setUrlsByTeacher(urlsMap);
    } catch (error) {
      console.error("Error fetching initial URLs:", error);
      toast.error("Failed to fetch initial URLs. Please try again.", {
        autoClose: toastTimer,
      });
    }
  };

  useEffect(() => {
    fetchURLS();

    // Real-time subscription
    const urlsSubscription = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_TEACHERS}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          ) ||
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          ) ||
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          fetchURLS(); // Fetch updated URLs when changes occur
        }
      }
    );

    return () => {
      urlsSubscription(); // Unsubscribe when the component unmounts
    };
  }, []);

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
      return true;
    } catch (err) {
      console.error("Error creating user:", err);
      toast.update(toastId, {
        render: "Failed to create teacher. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
      return false;
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
      let alreadyExists = await checkIDInDatabase(urlID);
      if (alreadyExists) {
        toast.update(toastId, {
          render: "ID Already exists enter a uniqu ID.",
          type: "warning",
          isLoading: false,
          autoClose: toastTimer,
        });
        return;
      }
      let teacherID = await getUserID();

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
      return true;
    } catch (err) {
      console.error("Error creating URL:", err);
      toast.update(toastId, {
        render: "Failed to create URL. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
      return false;
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
      toast.update(toastId, {
        render: "Deleting Files under that URL...",
        type: "loading",
        isLoading: true,
        autoClose: toastTimer,
      });

      const files = filesByUrl[urlID] || [];
      // console.log(filesByUrl[urlID]);

      // Delete each file under the URL
      await Promise.all(
        files.map(async (file) => {
          await handleFileDelete(file.id);
        })
      );

      // Update filesByUrl state after deletion
      setFilesByUrl((prev) => {
        const updatedFiles = { ...prev };
        delete updatedFiles[urlID]; // Remove the deleted URL and its files
        return updatedFiles;
      });

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
        render: "URL deleted successfully.",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (error) {
      console.error("Error deleting URL:", error);
      toast.update(toastId, {
        render: "Failed to delete URL. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
    }
  };

  const contextData = {
    teachers,
    teacherImages,
    createTeacher,
    copyToClipboard,
    deleteURL,
    DomainURL,
    urlsByTeacher,
    createURL,
    toastTimer,
    getUserID,
  };

  return (
    <ActionContext.Provider value={contextData}>
      {children}
    </ActionContext.Provider>
  );
};

export { ActionsProvider, useAction };
