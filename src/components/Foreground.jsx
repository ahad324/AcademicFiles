import React, { useRef, useState, useEffect } from "react";
import { useData } from "../contexts/DataContext.jsx";
import Card from "./Card";
import UploadFileButton from "./UploadFileButton";
import Loader from "./Loader.jsx";
import { useAuth } from "../contexts/AuthContext";
import CountUp from "react-countup";

const Foreground = ({ urlID }) => {
  const ref = useRef();
  const [loading, setLoading] = useState(true);
  const { filesByUrl } = useData();
  const { User } = useAuth();
  const [visibleFiles, setVisibleFiles] = useState(25); // Number of files currently visible

  useEffect(() => {
    setLoading(false);
  }, [urlID, filesByUrl]);

  const files = filesByUrl[urlID] || [];

  const loadMoreFiles = () => {
    setVisibleFiles((prevVisibleFiles) => prevVisibleFiles + 25);
  };

  return (
    <>
      {files.length > 0 && (
        <div className="text-[--text-color] absolute z-[2] top-20 w-full flex justify-end items-center">
          <h2 className="p-3 rounded-lg border-2 border-[--accent-color] backdrop-blur-3xl shadow-custom font-semibold">
            Files Count: <CountUp start={0} end={files.length} duration={5} />
          </h2>
        </div>
      )}
      <div
        ref={ref}
        className="fixed top-10 left-0 z-[1] w-full h-full p-5 py-52 overflow-auto flex flex-wrap gap-10 justify-center items-center pt-14"
      >
        {loading ? (
          <Loader />
        ) : files.length > 0 ? (
          <>
            {files.slice(0, visibleFiles).map((item) => (
              <Card data={item} reference={ref} key={item.id} />
            ))}
            {visibleFiles < files.length && (
              <button
                onClick={loadMoreFiles}
                className="mt-5 p-3 bg-[--secondary-color] text-[--default-text-color] font-semibold rounded-lg shadow-custom hover:bg-[--secondary-color-hover]"
              >
                Load More
              </button>
            )}
          </>
        ) : (
          <div
            className={`flex justify-center items-center flex-col w-full h-full ${
              User ? "relative" : "absolute"
            } top-0`}
          >
            <h2 className="text-3xl text-[--error-color]">No files here.</h2>
          </div>
        )}
        <UploadFileButton />
      </div>
    </>
  );
};

export default Foreground;
