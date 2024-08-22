import React, { useState } from "react";
import Loader from "./Loader";
import { useData } from "../contexts/DataContext";
import { calculation } from "../utils/utils";
import { FaCloudUploadAlt } from "react-icons/fa";

const UploadFileButton = () => {
  const { handleFileUpload, MAX_FILE_SIZE } = useData(); // Destructure from context
  const [isUploading, setIsUploading] = useState(false);
  const { value, unit } = calculation(MAX_FILE_SIZE);
  const [showPopup, setShowPopup] = useState(false);
  const [zipFileName, setZipFileName] = useState("");

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    if (files.length > 1) {
      setShowPopup(true);
    } else {
      setIsUploading(true);
      await handleFileUpload(files);
      setIsUploading(false);
    }
  };
  const handleUpload = async () => {
    setIsUploading(true);
    setShowPopup(false);
    const files = document.querySelector('input[type="file"]').files;
    await handleFileUpload(files, zipFileName);
    setIsUploading(false);
  };

  return isUploading ? (
    <div className="fixed h-full w-full">
      <span className="fixed top-1/2 left-1/2 text-xl text-center transform -translate-x-1/2 font-semibold text-[--text-color] backdrop-blur-md border-2 border-[--text-color] rounded-3xl p-4 bg-[--card-bg]">
        <Loader /> <p>Uploading...</p>
      </span>
    </div>
  ) : (
    <div className="fixed bottom-2  flex justify-between items-center flex-col w-full">
      <label className="cursor-pointer flex justify-center items-center">
        <span className="flex justify-evenly items-center w-44 shadow-custom text-[--default-text-color] bg-[--secondary-color] transition-colors hover:bg-[--secondary-color-hover] p-3  rounded-2xl text-lg font-semibold border-2 border-[--text-color]">
          Upload File
          <FaCloudUploadAlt size="1.5em" />
        </span>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
      <p className="text-[--default-text-color] font-semibold mt-3 border-2 border-[--text-color] shadow-custom bg-[--error-color] p-2 rounded-xl">
        Maximum file size: {value + unit}
      </p>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="fixed w-full sm:w-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[--bg-color] p-4 border-2 rounded-lg text-[--text-color]">
            <h2 className="text-lg font-semibold mb-2">Enter Zip File Name</h2>
            <input
              type="text"
              value={zipFileName}
              onChange={(e) => setZipFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && zipFileName) {
                  handleUpload();
                }
              }}
              className="border p-2 rounded w-full text-black"
              placeholder="Zip File Name"
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-[--secondary-color] px-4 py-2 rounded mr-2 text-[--default-text-color] hover:bg-[--secondary-color-hover]"
                onClick={handleUpload}
                disabled={!zipFileName}
              >
                Upload
              </button>
              <button
                className="bg-[--light-gray-color] text-[--text-color] px-4 py-2 rounded hover:bg-[--medium-gray-color]"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFileButton;
