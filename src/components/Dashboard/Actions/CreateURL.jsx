import React, { useState } from "react";
import { useAction } from "@contexts/ActionsContext";
import { FaCheck, FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";

const CreateURL = () => {
  const [urlID, setUrlID] = useState("");
  const [copied, setCopied] = useState(false);
  const { createURL, DomainURL, copyToClipboard, toastTimer } = useAction();

  const handleCreate = async () => {
    if (urlID.trim() === "") {
      toast.error("URL ID cannot be empty", { autoClose: toastTimer });
      return;
    }
    await createURL(urlID);
  };

  const handleCopy = () => {
    setCopied(true);
    copyToClipboard(`${DomainURL}${urlID}`);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 overflow-auto">
      <div className="bg-[--dark-gray-color] p-6 rounded-lg shadow-custom border border-[--text-color]">
        <div className="flex items-center justify-center mb-4">
          <input
            type="text"
            value={urlID}
            onChange={(e) => setUrlID(e.target.value)}
            placeholder="Enter ID"
            className="p-2.5 border border-[--medium-gray-color] rounded-l-lg w-64"
          />
          <button
            onClick={handleCreate}
            className="bg-[--secondary-color] text-[--default-text-color] p-2.5 rounded-r-lg hover:bg-[--secondary-color-hover]"
          >
            Create
          </button>
        </div>
        <span className="text-[--light-gray-color]">Your Link: </span>
        <p className="text-[--default-text-color]">{`${DomainURL}${urlID}`}</p>
        <button className="flex items-center justify-center w-full mt-2 text-[--secondary-color-hover] overflow-auto">
          {copied ? (
            <FaCheck size="1.4em" color="var(--accent-color)" />
          ) : (
            <FaCopy size="1.4em" onClick={handleCopy} />
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateURL;
