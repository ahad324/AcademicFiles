import React, { useState } from "react";
import { useAction } from "@contexts/ActionsContext";
import { FaCheck, FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";

const CreateURL = () => {
  const [urlID, setUrlID] = useState("");
  const [copied, setCopied] = useState(false);
  const { createURL, DomainURL, copyToClipboard, toastTimer } = useAction();

  const handleCreate = async (e) => {
    e.target.disabled = true;
    if (urlID.trim() === "") {
      toast.error("URL ID cannot be empty", { autoClose: toastTimer });
      return;
    }
    await createURL(urlID);
    e.target.disabled = false;
  };

  const handleCopy = () => {
    setCopied(true);
    copyToClipboard(`${DomainURL}${urlID}`);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="bg-[--dark-gray-color] p-6 rounded-lg shadow-custom border border-[--text-color] overflow-auto w-full xs:w-fit">
        <h2 className="text-3xl text-[--default-text-color] w-full text-center mb-3 font-semibold">
          Create URL
        </h2>
        <div className="flex items-center justify-between h-28 xs:h-fit xs:justify-center mb-4 flex-col xs:flex-row ">
          <input
            type="text"
            autoFocus
            value={urlID}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreate(e);
              }
            }}
            onChange={(e) => setUrlID(e.target.value.replace(/\s/g, ""))}
            placeholder="Enter ID"
            className="p-2.5 border border-[--medium-gray-color] rounded-lg xs:rounded-r-none w-64"
          />
          <button
            onClick={(e) => {
              handleCreate(e);
            }}
            className="bg-[--secondary-color] text-[--default-text-color] p-2.5 rounded-lg xs:rounded-l-none hover:bg-[--secondary-color-hover]"
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
