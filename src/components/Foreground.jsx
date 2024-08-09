import React, { useRef, useState, useEffect } from "react";
import { useData } from "../contexts/DataContext.jsx";
import Card from "./Card";
import UploadFileButton from "./UploadFileButton";
import Loader from "./Loader.jsx";
import { useAuth } from "../contexts/AuthContext";

const Foreground = () => {
  const ref = useRef();
  const [loading, setloading] = useState(true);
  const { allFiles } = useData();

  const { User } = useAuth();

  useEffect(() => {
    setloading(false);
  }, []);

  return (
    <div
      ref={ref}
      // fixed top-0 left-0 z-[3] w-full h-full flex justify-center items-center gap-10 flex-wrap p-5 overflow-auto
      className={`relative top-0 left-0 z-[3] w-full h-full p-5 overflow-auto flex flex-wrap gap-10 justify-center items-center`}
    >
      {loading ? (
        <Loader />
      ) : allFiles.length > 0 ? (
        allFiles.map((item) => (
          <Card data={item} reference={ref} key={item.id} />
        ))
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
      {/* Pass upload handler to button */}
    </div>
  );
};

export default Foreground;
