import React, { useState } from "react";
import Loader from "./Loader";
import { useData } from "../contexts/DataContext";
import { calculation } from "../utils/utils";
import { FaCloudUploadAlt } from "react-icons/fa";

const UploadFileButton = () => {
  const { handleFileUpload, MAX_FILE_SIZE } = useData(); // Destructure from context
  const [isUploading, setIsUploading] = useState(false);
  const { value, unit } = calculation(MAX_FILE_SIZE);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const uploadSuccess = await handleFileUpload(file);

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
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
      <p className="text-[--default-text-color] font-semibold mt-3 border-2 border-[--text-color] shadow-custom bg-[--error-color] p-2 rounded-xl">
        Maximum file size: {value + unit}
      </p>
    </div>
  );
};

export default UploadFileButton;
