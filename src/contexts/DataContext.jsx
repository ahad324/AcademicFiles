import React, { createContext, useContext, useState, useEffect } from "react";
import {
  storage,
  account,
  databases,
  avatars,
  BUCKET_ID,
  PROJECT_ID,
  DATABASE_ID,
  COLLECTION_ID_TEACHERS,
  COLLECTION_ID_FILES,
  client,
  ID,
  Query,
} from "../AppwriteConfig";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const {
    User,
    isAdmin,
    toastTimer,
    APP_NAME,
    DomainURL,
    MAX_FILE_SIZE_MB,
    MAX_FILE_SIZE_BYTES,
    TOTAL_STORAGE,
  } = useAuth();
  const [allFiles, setAllFiles] = useState([]);
  const [teacherFiles, setteacherFiles] = useState([]);
  const [filesByUrl, setFilesByUrl] = useState({});
  const [urlID, seturlID] = useState(null);
  const [teacherID, setteacherID] = useState(null);
  const [storageOccupied, setStorageOccupied] = useState(0); // State for storage occupied
  const [storageData, setStorageData] = useState({
    total: TOTAL_STORAGE,
    occupied: parseFloat(storageOccupied).toFixed(2),
    percentage: "0.00",
  });
  const [userDetails, setUserDetails] = useState({});

  const fetchFilesByUrlID = async (urlID) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_FILES,
        [Query.equal("urlId", urlID)]
      );
      const filesData = response.documents.map((file) => ({
        id: file.$id,
        desc: file.File[1],
        filesize: file.File[2],
        downloadUrl: file.File[3],
      }));
      setFilesByUrl((prev) => ({
        ...prev,
        [urlID]: filesData,
      }));
    } catch (error) {
      console.error("Error fetching files by URL ID:", error);
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await storage.listFiles(BUCKET_ID);
        const filesData = response.files.map((file) => ({
          id: file.$id,
          desc: file.name,
          filesize: `${(file.sizeOriginal / 1024).toFixed(2)} KB`,
          downloadUrl: `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${file.$id}/download?project=${PROJECT_ID}`,
        }));
        setAllFiles(filesData);

        // Calculate storage usage
        const totalSize = response.files.reduce(
          (acc, file) => acc + file.sizeOriginal,
          0
        );
        setStorageOccupied(totalSize / (1024 * 1024)); // Convert bytes to MB
      } catch (error) {
        toast.error("Error fetching files.", { autoClose: toastTimer });
        console.error("Error fetching files:", error);
      }
    };

    const fetchTeacherFiles = async () => {
      const toastId = toast.loading("Fetching teacher Files...");
      try {
        // Check if id is passed otherwise get the current user id,
        const ID = await getUserID();

        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID_FILES,
          [Query.equal("TeacherID", ID)]
        );
        const filesData = response.documents.map((file) => ({
          id: file.$id,
          desc: file.File[1],
          filesize: file.File[2],
          downloadUrl: file.File[3],
        }));
        setteacherFiles(filesData);

        toast.update(toastId, {
          render: "",
          type: "success",
          isLoading: false,
          autoClose: toastTimer,
        });
      } catch (error) {
        toast.update(toastId, {
          render: "Failed to fetch files.Please try again.",
          type: "error",
          isLoading: false,
          autoClose: toastTimer,
        });
        console.error("Error fetching files by for teacher:", error);
      }
    };
    // Fetch initial files
    fetchFiles();
    if (User) fetchTeacherFiles();

    // Set up real-time updates for all files
    const fileSubscription = client.subscribe("files", (response) => {
      if (
        response.events.includes(`buckets.${BUCKET_ID}.files.*.create`) ||
        response.events.includes(`buckets.${BUCKET_ID}.files.*.delete`)
      ) {
        fetchFiles(); // Refresh file list on new upload or delete
      }
    });

    // Set up real-time updates for teacher files
    let teacherSubscription;
    if (User) {
      teacherSubscription = client.subscribe(
        `databases.${DATABASE_ID}.collections.${COLLECTION_ID_FILES}.documents`,
        (response) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            ) ||
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            fetchTeacherFiles();
          }
        }
      );
    }

    // Setup for Realtime upfates for Files under URL.
    let urlFilesSubscription;
    if (urlID) {
      urlFilesSubscription = client.subscribe(
        `databases.${DATABASE_ID}.collections.${COLLECTION_ID_FILES}.documents`,
        (response) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            ) ||
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            fetchFilesByUrlID(urlID);
          }
        }
      );
    }

    return () => {
      fileSubscription();
      if (urlFilesSubscription) {
        fetchFilesByUrlID(urlID);
      }
      if (teacherSubscription) {
        teacherSubscription();
      }
    };
  }, [urlID]);
  // [User, isAdmin]

  useEffect(() => {
    const percentageUsed =
      (parseFloat(storageOccupied) / storageData.total) * 100;
    const formattedPercentage = percentageUsed.toFixed(2);

    setStorageData({
      total: TOTAL_STORAGE,
      occupied: parseFloat(storageOccupied).toFixed(2),
      percentage: formattedPercentage,
    });
  }, [storageOccupied]);

  const getProfileImage = async (initials) => {
    try {
      const avatarURL = avatars.getInitials(initials);
      return avatarURL.href;
    } catch (error) {
      console.error("Error getting profile image:", error);
      return "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";
    }
  };

  const getUserID = async () => {
    try {
      // Get the currently logged-in user's ID
      const acc = await account.get();
      const id = acc.$id;
      return id;
    } catch (error) {
      console.error("Error getting User ID.");
      throw error;
    }
  };

  const handleFileUpload = async (file) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE_MB} MB.`, {
        autoClose: toastTimer,
      });
      return false;
    }
    const newStorageOccupied = storageOccupied + file.size / (1024 * 1024);
    if (newStorageOccupied > storageData.total) {
      toast.error("Not enough storage left.", { autoClose: toastTimer });
      return false;
    }

    try {
      const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
      const fileData = {
        id: response.$id,
        desc: response.name,
        filesize: `${(file.size / 1024).toFixed(2)} KB`,
        downloadUrl: `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${response.$id}/download?project=${PROJECT_ID}`,
      };
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID_FILES,
        response.$id,
        {
          TeacherID: teacherID,
          urlId: urlID,
          File: [
            fileData.id,
            fileData.desc,
            fileData.filesize,
            fileData.downloadUrl,
          ],
        }
      );
      setAllFiles([...allFiles, fileData]);

      setStorageOccupied(newStorageOccupied);
      toast.success("File uploaded successfully.", { autoClose: toastTimer });
      return true;
    } catch (error) {
      toast.error("Error uploading file. Please try again.", {
        autoClose: toastTimer,
      });
      console.error("Error uploading file:", error);
      return false;
    }
  };

  const handleFileDelete = async (fileId, urlid) => {
    let toastId = toast.loading(`Deleting file...`);
    try {
      await storage.deleteFile(BUCKET_ID, fileId);
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_FILES, fileId);

      // Update the local state for allFiles
      setAllFiles((prevFiles) =>
        prevFiles.filter((item) => item.id !== fileId)
      );

      // Update the teacherFiles state
      setteacherFiles((prevFiles) =>
        prevFiles.filter((item) => item.id !== fileId)
      );
      // Update urlFiles state
      if (urlid) {
        setFilesByUrl((prev) => ({
          ...prev,
          [urlid]: prev[urlid].filter((file) => file.id !== fileId),
        }));
      }

      const updatedFiles = allFiles.filter((item) => item.id !== fileId);
      const totalSize = updatedFiles.reduce(
        (acc, file) => acc + file.filesize,
        0
      );
      setStorageOccupied(totalSize / (1024 * 1024)); // Convert bytes to MB
      toast.update(toastId, {
        render: "File deleted successfully.",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to delete file.Please try again.",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
      console.error("Error deleting file:", error);
    }
  };

  const downloadAllFiles = async (e) => {
    const Files = isAdmin ? allFiles : teacherFiles;
    if (!Files.length) {
      return;
    }
    e.target.textContent = "Downloading...";
    const zip = new JSZip();
    const folder = zip.folder("files");

    try {
      const filePromises = Files.map(async (file) => {
        try {
          const downloadUrl = file.downloadUrl;

          if (!downloadUrl) {
            throw new Error(`Failed to fetch file with ID: ${file.id}`);
          }

          const response = await fetch(downloadUrl);
          if (!response.ok) throw new Error("Network response was not ok");

          const blob = await response.blob();
          folder.file(file.desc, blob);
        } catch (error) {
          console.error(`Error fetching file ${file.desc}:`, error);
        }
      });

      await Promise.all(filePromises);

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "files.zip");

      e.target.textContent = "Download All Files";
      toast.success("All files downloaded successfully.", {
        autoClose: toastTimer,
      });
    } catch (error) {
      toast.error("Error creating ZIP file. Please try again.", {
        autoClose: toastTimer,
      });
      console.error("Error creating ZIP file:", error);
      e.target.textContent = "Download All Files";
    }
  };

  const deleteAllFiles = async (e) => {
    const Files = isAdmin ? allFiles : teacherFiles;
    if (!Files.length) {
      return;
    }
    e.target.textContent = "Deleting...";
    try {
      const deletePromises = Files.map(async (file) => {
        await handleFileDelete(file.id);
      });

      await Promise.all(deletePromises);

      if (isAdmin) {
        setAllFiles([]);
        setStorageOccupied(0);
      } else {
        setteacherFiles([]);
      }

      toast.success("All files deleted successfully.", {
        autoClose: toastTimer,
      });
    } catch (error) {
      toast.error("Error deleting all files. Please try again.", {
        autoClose: toastTimer,
      });
      console.error("Error deleting all files:", error);
    } finally {
      e.target.textContent = "Delete All Files";
    }
  };

  const getuserdetails = async () => {
    try {
      const user = await account.get();
      const URL = await getProfileImage(user.name);
      setUserDetails({
        name: user.name,
        email: user.email,
        imageUrl: URL,
      });
      return user; // Will be used in settings component
    } catch (error) {
      toast.error("Error fetching user details.", { autoClose: toastTimer });
      console.error("Error fetching user details:", error);
      return;
    }
  };

  const checkIDInDatabase = async (id) => {
    const toastId = toast.loading("Checking ID...");
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        [Query.equal("urls", id)]
      );
      // console.log(response);
      if (response.total > 0) {
        seturlID(id);
        setteacherID(response.documents[0].$id);
        toast.update(toastId, {
          render: "ID found.",
          type: "success",
          isLoading: false,
          autoClose: toastTimer,
        });
        return true;
      } else {
        toast.update(toastId, {
          render: "ID not found.",
          type: "error",
          isLoading: false,
          autoClose: toastTimer,
        });
        return false;
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Error checking ID.",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
      console.error("Error checking ID:", error);
      return false;
    }
  };
  return (
    <DataContext.Provider
      value={{
        APP_NAME,
        DomainURL,
        allFiles,
        teacherFiles,
        urlID,
        storageData,
        handleFileUpload,
        handleFileDelete,
        deleteAllFiles,
        downloadAllFiles,
        getuserdetails,
        userDetails,
        checkIDInDatabase,
        getProfileImage,
        getUserID,
        fetchFilesByUrlID,
        filesByUrl,
        MAX_FILE_SIZE_MB,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
