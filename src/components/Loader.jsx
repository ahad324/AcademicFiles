import React from "react";

const Loader = ({ isMain = false }) => {
  return (
    <div
      className={`relative z-10 flex-col gap-4 w-full flex items-center justify-center h-${
        isMain ? "screen" : "full"
      } ${isMain && "bg-[--bg-color]"}`}
    >
      <div className="w-20 h-20 border-4 border-transparent text-[--secondary-color] text-4xl animate-spin flex items-center justify-center border-t-[--secondary-color] rounded-full">
        <div className="w-16 h-16 border-4 border-transparent text-[--accent-color] text-2xl animate-spin flex items-center justify-center border-t-[--accent-color] rounded-full"></div>
      </div>
    </div>
  );
};

export default Loader;
