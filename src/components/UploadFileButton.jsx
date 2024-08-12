import React, { useState } from "react";
import Loader from "./Loader";
import { useData } from "../contexts/DataContext";
import { calculation } from "../utils/utils";

const UploadFileButton = () => {
  const { handleFileUpload, error, MAX_FILE_SIZE } = useData(); // Destructure from context
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
      <span className="fixed top-1/2 left-1/2 text-xl text-center transform -translate-x-1/2 font-semibold text-[--text-color] backdrop-blur-md border border-[--text-color] rounded-3xl p-4 bg-[--card-bg]">
        <Loader /> <p>Uploading...</p>
      </span>
    </div>
  ) : (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-between items-center flex-col w-full">
      <label className="cursor-pointer">
        <span className="shadow-custom text-[--default-text-color] bg-[--secondary-color] transition-colors hover:bg-[--secondary-color-hover] px-4 py-2 rounded border border-[--default-text-color]">
          Upload File
        </span>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
      {error && (
        <p className="text-[--error-color] mt-3 font-semibold">{error}</p>
      )}
      <p className="text-[--text-color] font-semibold mt-3">
        Maximum file size: {value + unit}
      </p>
    </div>
  );
};

export default UploadFileButton;
