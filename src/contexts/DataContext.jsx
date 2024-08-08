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

const MAX_FILE_SIZE_MB = 50; // Maximum file size in MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const toastTimer = 3000;
  const [data, setData] = useState([]);
  const [urlID, seturlID] = useState(null);
  const [storageOccupied, setStorageOccupied] = useState(0); // State for storage occupied
  const [storageData, setStorageData] = useState({
    total: 2048,
    occupied: parseFloat(storageOccupied).toFixed(2),
    percentage: "0.00",
  });
  const [userDetails, setUserDetails] = useState({});

  const APP_NAME = "AcademicFileRelay";

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await storage.listFiles(BUCKET_ID);
        const filesData = response.files.map((file) => ({
          id: file.$id,
          desc: file.name,
          filesize: `${(file.sizeOriginal / 1024).toFixed(2)} KB`,
          url: `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`,
        }));
        setData(filesData);

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
    // const example = async () => {
    //   const response = await databases.createDocument(
    //     DATABASE_ID,
    //     COLLECTION_ID_FILES,
    //     ID.unique(),
    //     {
    //       TeacherID: "TeacherID",
    //       urlId: "urlId",
    //       File: ["ahad", "gujjar", "132123"],
    //     }
    //   );
    //   console.log(response);
    // };
    // example();
    fetchFiles();

    // Setting up for Realtime-Updates
    const unsubscribe = client.subscribe("files", (response) => {
      if (response.events.includes(`buckets.${BUCKET_ID}.files.*.create`)) {
        fetchFiles(); // Refresh file list on new upload
      } else if (
        response.events.includes(`buckets.${BUCKET_ID}.files.*.delete`)
      ) {
        fetchFiles();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const percentageUsed =
      (parseFloat(storageOccupied) / storageData.total) * 100;
    const formattedPercentage = percentageUsed.toFixed(2);

    setStorageData({
      total: 2048,
      occupied: parseFloat(storageOccupied).toFixed(2),
      percentage: formattedPercentage,
    });
  }, [storageOccupied]);

  const handleFileUpload = async (file) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE_MB} MB.`, {
        autoClose: toastTimer,
      });
      return false;
    }

    if (storageOccupied + file.size / (1024 * 1024) > storageData.total) {
      toast.error("Not enough storage left.", { autoClose: toastTimer });
      return false;
    }

    try {
      const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
      const fileData = {
        id: response.$id,
        name: response.name,
        desc: response.name,
        filesize: `${(file.size / 1024).toFixed(2)} KB`,
        url: `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${response.$id}/view?project=${PROJECT_ID}`,
      };
      setData([...data, fileData]);
      setStorageOccupied((prev) => prev + file.size / (1024 * 1024)); // Update storage occupied
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

  const handleFileDelete = async (fileId) => {
    try {
      await storage.deleteFile(BUCKET_ID, fileId);
      setData((prevData) => prevData.filter((item) => item.id !== fileId));
      const updatedFiles = data.filter((item) => item.id !== fileId);
      const totalSize = updatedFiles.reduce(
        (acc, file) => acc + file.filesize,
        0
      );
      setStorageOccupied(totalSize / (1024 * 1024)); // Convert bytes to MB
      toast.success("File deleted successfully.", { autoClose: toastTimer });
    } catch (error) {
      toast.error("Error deleting file.", { autoClose: toastTimer });
      console.error("Error deleting file:", error);
    }
  };

  const handleFileDownload = async (data) => {
    try {
      const result = await storage.getFileDownload(BUCKET_ID, data.id);
      const downloadUrl = result;

      if (!downloadUrl) throw new Error("Download URL was not retrieved");

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = data.desc;
      document.body.appendChild(link);
      link.click();

      link.remove();
      toast.success("File downloaded successfully.", { autoClose: toastTimer });
    } catch (error) {
      toast.error("Download error. Please try again.", {
        autoClose: toastTimer,
      });
      console.error("Download error:", error);
    }
  };

  const downloadAllFiles = async (e) => {
    e.target.textContent = "Downloading...";
    const zip = new JSZip();
    const folder = zip.folder("files");

    try {
      const filePromises = data.map(async (file) => {
        try {
          const downloadUrl = storage.getFileDownload(BUCKET_ID, file.id);

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

  const deleteAllFiles = async () => {
    try {
      const deletePromises = data.map(async (file) => {
        await storage.deleteFile(BUCKET_ID, file.id);
      });

      await Promise.all(deletePromises);

      setData([]);
      setStorageOccupied(0);
      toast.success("All files deleted successfully.", {
        autoClose: toastTimer,
      });
    } catch (error) {
      toast.error("Error deleting all files. Please try again.", {
        autoClose: toastTimer,
      });
      console.error("Error deleting all files:", error);
    }
  };

  const getuserdetails = async () => {
    try {
      const user = await account.get();
      const URL = avatars.getInitials(user.name);
      setUserDetails({
        name: user.name,
        email: user.email,
        imageUrl: URL.href,
      });
    } catch (error) {
      toast.error("Error fetching user details.", { autoClose: toastTimer });
      console.error("Error fetching user details:", error);
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

      if (response.total > 0) {
        seturlID(id);
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
        data,
        urlID,
        storageData,
        handleFileUpload,
        handleFileDelete,
        handleFileDownload,
        deleteAllFiles,
        downloadAllFiles,
        getuserdetails,
        userDetails,
        checkIDInDatabase,
        APP_NAME,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
