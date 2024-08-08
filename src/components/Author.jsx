import React from "react";
import Logo from "../assets/Logo.jpg";

const Author = () => {
  return (
    <div className="fixed shadow-custom bottom-2 font-semibold right-2 md:bottom-1.5 md:right-1.5 bg-[--author-bg] text-[--author-text-color] text-xs p-2 rounded-lg z-10 flex items-center border-2 border-[--author-text-color] transition-colors duration-300">
      <a
        href="https://ahad324.github.io/AllProjects/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center"
      >
        <img src={Logo} alt="AbdulAhad" className="w-5 h-5 rounded-full" />
        <span className="hidden sm:inline-block ml-2 underline cursor-pointer hover:text-gray-400">
          Made by AbdulAhad
        </span>
      </a>
    </div>
  );
};

export default Author;
