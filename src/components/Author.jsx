import React from "react";
import Logo from "../assets/Logo.jpg";

const Author = () => {
  return (
    <div className="fixed bottom-1.5 right-1.5 z-10">
      <a
        href="https://ahad324.github.io/AllProjects/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center w-12 bg-[--author-bg] text-[--author-text-color] text-xs p-2 rounded-lg border-2 border-[--author-text-color] transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap hover:w-48"
      >
        <img src={Logo} alt="AbdulAhad" className="w-7 h-7 rounded-full" />
        <span className="ml-3 font-semibold inline-block hover:underline">
          Made by AbdulAhad
        </span>
      </a>
    </div>
  );
};

export default Author;
