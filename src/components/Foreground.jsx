import React, { useRef, useState, useEffect } from "react";
import { useData } from "../contexts/DataContext.jsx";
import Card from "./Card";
import UploadFileButton from "./UploadFileButton";
import Loader from "./Loader.jsx";
import { useAuth } from "../contexts/AuthContext";

const Foreground = ({ urlID }) => {
  const ref = useRef();
  const [loading, setloading] = useState(true);
  const { filesByUrl, fetchFilesByUrlID } = useData();

  const { User } = useAuth();

  useEffect(() => {
    fetchFilesByUrlID(urlID);
    setloading(false);
  }, []);

  const files = filesByUrl[urlID] || [];

  return (
    <div
      ref={ref}
      className={`relative top-0 left-0 z-[3] w-full h-full p-5 overflow-auto flex flex-wrap gap-10 justify-center items-center`}
    >
      {loading ? (
        <Loader />
      ) : files.length > 0 ? (
        files.map((item) => <Card data={item} reference={ref} key={item.id} />)
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
  );
};

export default Foreground;
