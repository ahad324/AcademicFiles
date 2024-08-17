import React from "react";
import { MdDownloadForOffline, MdDownloadDone } from "react-icons/md";
import { useData } from "@contexts/DataContext";

const DownloadingToast = () => {
  const { showDownloadingToast, filesDownloaded, totalFiles } = useData();

  if (!showDownloadingToast) {
    return null; // Render nothing if the toast should not be shown
  }

  return (
    <div
      id="toast-default"
      className="fixed bottom-4 border border-[--text-color] right-4 flex items-center w-64 max-w-xs p-4 text-[--text-color] bg-[--bg-color] rounded-lg shadow-custom transition-opacity duration-300"
      role="alert"
      aria-live="polite"
    >
      <div
        className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${
          filesDownloaded === totalFiles
            ? "bg-transparent"
            : "bg-[--secondary-color]"
        } rounded-lg text-[--default-text-color] shadow-custom`}
      >
        {filesDownloaded === totalFiles ? (
          <MdDownloadDone size="1.5em" color="var(--accent-color)" />
        ) : (
          <MdDownloadForOffline size="1.5em" />
        )}
      </div>
      <div className="ms-3 text-sm font-normal">
        {filesDownloaded === totalFiles ? "Downloaded" : "Downloading..."}{" "}
        {filesDownloaded}/{totalFiles}
      </div>
    </div>
  );
};

export default DownloadingToast;
