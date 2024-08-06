import React, { createContext, useContext, useState, useEffect } from "react";
import { storage, BUCKET_ID, PROJECT_ID, client, ID } from "../AppwriteConfig";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Loader from "../components/Loader";

const MAX_FILE_SIZE_MB = 50; // Maximum file size in MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingFileId, setDeletingFileId] = useState(null);
  const [storageOccupied, setStorageOccupied] = useState(0); // State for storage occupied
  const [storageTotal, setStorageTotal] = useState(0); // State for total storage

  const APP_NAME = "AcademicFileRelay";

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
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

        setStorageTotal(2048);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

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

  const handleFileUpload = async (file) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds ${MAX_FILE_SIZE_MB} MB.`);
      setTimeout(() => {
        setError("");
      }, 3000);
      return false;
    }

    // if (data.some((existingFile) => existingFile.desc === file.name)) {
    //   setError("File with this name already exists.");
    //   setTimeout(() => {
    //     setError("");
    //   }, 5000);
    //   return false;
    // }

    if (storageOccupied + file.size / (1024 * 1024) > storageTotal) {
      setError("Not enough storage left.");
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
      setError("");
      return true;
    } catch (error) {
      setError("Error uploading file. Please try again.");
      console.error("Error uploading file:", error);
      return false;
    }
  };

  const handleFileDelete = async (fileId) => {
    setDeletingFileId(fileId);
    try {
      await storage.deleteFile(BUCKET_ID, fileId);
      // Update the data state by removing the deleted file
      setData((prevData) => prevData.filter((item) => item.id !== fileId));
      // Update storageOccupied
      const updatedFiles = data.filter((item) => item.id !== fileId);
      const totalSize = updatedFiles.reduce(
        (acc, file) => acc + file.filesize,
        0
      );
      setStorageOccupied(totalSize / (1024 * 1024)); // Convert bytes to MB
      setDeletingFileId(null);
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setDeletingFileId(null);
    }
  };
  const handleFileDownload = async (data) => {
    try {
      const result = await storage.getFileDownload(BUCKET_ID, data.id);
      const downloadUrl = result; // This is the URL to the file

      if (!downloadUrl) throw new Error("Download URL was not retrieved");

      // Create a link element to initiate the download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = data.desc;
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
    } catch (error) {
      console.error("Download error:", error);
    }
  };
  const downloadAllFiles = async (e) => {
    e.target.textContent = "Downloading...";
    const zip = new JSZip();
    const folder = zip.folder("files");

    try {
      // Fetch and process each file
      const filePromises = data.map(async (file) => {
        try {
          const downloadUrl = storage.getFileDownload(BUCKET_ID, file.id);

          if (!downloadUrl) {
            throw new Error(`Failed to fetch file with ID: ${file.id}`);
          }

          // Fetch the file blob
          const response = await fetch(downloadUrl);
          if (!response.ok) throw new Error("Network response was not ok");

          const blob = await response.blob();
          folder.file(file.desc, blob);
        } catch (error) {
          console.error(`Error fetching file ${file.desc}:`, error);
        }
      });

      await Promise.all(filePromises);

      // Generate the ZIP file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "files.zip");

      e.target.textContent = "Download All Files";
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      e.target.textContent = "Download All Files";
    }
  };

  const deleteAllFiles = async () => {
    setLoading(true);
    try {
      // Iterate over all files and delete them
      const deletePromises = data.map(async (file) => {
        await storage.deleteFile(BUCKET_ID, file.id);
      });

      await Promise.all(deletePromises);

      // Clear the state after all deletions are complete
      setData([]);
      setStorageOccupied(0); // Reset storage occupied
    } catch (error) {
      console.error("Error deleting all files:", error);
      setError("Error deleting all files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contextData = {
    APP_NAME,
    data,
    loading,
    error,
    deletingFileId,
    handleFileUpload,
    handleFileDelete,
    handleFileDownload,
    downloadAllFiles,
    deleteAllFiles,
    storageOccupied,
    storageTotal,
    MAX_FILE_SIZE_MB,
    MAX_FILE_SIZE_BYTES,
  };

  return (
    <DataContext.Provider value={contextData}>
      {/* {loading ? <Loader /> : children} */}
      {children}
    </DataContext.Provider>
  );
};
