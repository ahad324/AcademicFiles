import React, { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
// Icons Imports
import {
  FaBars,
  FaTimes,
  FaChartBar,
  FaCogs,
  FaTrashAlt,
  FaTools,
} from "react-icons/fa"; // Import icons from react-icons
import { AiOutlineFile } from "react-icons/ai";
import { IoMdCloudDownload } from "react-icons/io";
import { MdLogout } from "react-icons/md";

import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";

import { calculation } from "../../utils/utils";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { handleLogout, isAdmin } = useAuth();
  const { teacherFiles } = useData();

  const {
    APP_NAME,
    allFiles,
    downloadAllFiles,
    deleteAllFiles,
    getuserdetails,
    userDetails,
    storageData,
  } = useData();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    getuserdetails();
  }, []);

  return (
    <section className="flex overflow-hidden h-screen">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[--sidebar-bg] transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-100`}
      >
        <div className="flex flex-col h-full overflow-y-auto shadow-2xl">
          <div className="flex flex-col flex-grow pt-5">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-xl font-medium tracking-tighter text-[--default-text-color]">
                {APP_NAME}
              </h2>
              <button
                className="rounded-lg text-[--default-text-color] focus:outline-none focus:shadow-outline md:hidden"
                onClick={toggleSidebar}
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col flex-grow px-4 mt-5 space-y-1">
              <ul>
                {/* Navigation items */}
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `inline-flex items-center w-full px-4 py-2 mt-1 text-base transition duration-500 ease-in-out transform rounded-lg text-[--default-text-color] ${
                        isActive
                          ? "bg-indigo-500"
                          : "hover:bg-[--secondary-color-hover]"
                      }`
                    }
                    to="overview"
                  >
                    <FaChartBar className="w-4 h-4" />
                    <span className="ml-4"> Overview</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `inline-flex items-center w-full px-4 py-2 mt-1 text-base transition duration-500 ease-in-out transform rounded-lg text-[--default-text-color] ${
                        isActive
                          ? "bg-indigo-500"
                          : "hover:bg-[--secondary-color-hover]"
                      }`
                    }
                    to="allfiles"
                  >
                    <AiOutlineFile className="w-4 h-4" />
                    <span className="ml-4">All Files </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `inline-flex items-center w-full px-4 py-2 mt-1 text-base transition duration-500 ease-in-out transform rounded-lg text-[--default-text-color] ${
                        isActive
                          ? "bg-indigo-500"
                          : "hover:bg-[--secondary-color-hover]"
                      }`
                    }
                    to="actions"
                  >
                    <FaTools className="w-4 h-4" />
                    <span className="ml-4">Actions</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `inline-flex items-center w-full px-4 py-2 mt-1 text-base transition duration-500 ease-in-out transform rounded-lg text-[--default-text-color] ${
                        isActive
                          ? "bg-indigo-500"
                          : "hover:bg-[--secondary-color-hover]"
                      }`
                    }
                    to="settings"
                  >
                    <FaCogs className="w-4 h-4" />
                    <span className="ml-4">Settings</span>
                  </NavLink>
                </li>
              </ul>
              <ul>
                <li>
                  <button
                    className="inline-flex items-center w-full px-4 py-2 mt-1 text-base text-[--default-text-color] transition duration-500 ease-in-out transform rounded-lg  hover:bg-[--accent-color]"
                    onClick={(e) => downloadAllFiles(null, e)}
                  >
                    <IoMdCloudDownload className="w-4 h-4" />
                    <span className="ml-4"> Download All Files</span>
                    <span className="absolute bottom-2.1 right-2 w-5 h-5 bg-[--error-color] text-[--default-text-color] rounded-full flex items-center justify-center text-xs">
                      {isAdmin ? allFiles.length : teacherFiles.length}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    className="inline-flex items-center w-full px-4 py-2 mt-1 text-base text-[--default-text-color] transition duration-500 ease-in-out transform rounded-lg hover:bg-[--error-color]"
                    onClick={deleteAllFiles}
                  >
                    <FaTrashAlt className="w-4 h-4" />
                    <span className="ml-4"> Delete All Files</span>
                    <span className="absolute bottom-2.1 right-2 w-5 h-5 bg-[--error-color] text-[--default-text-color] rounded-full flex items-center justify-center text-xs">
                      {isAdmin ? allFiles.length : teacherFiles.length}
                    </span>
                  </button>
                </li>
              </ul>
              <span className="px-4 pt-4 font-medium text-[--default-text-color] uppercase">
                <p>Storage</p>
                <h2 className="px-1 py-1 rounded-lg bg-[--default-text-color] text-[--accent-color] text-sm font-semibold w-fit flex ">
                  <p
                    className={`${
                      (storageData.percentage >= 50 &&
                        storageData.percentage <= 80 &&
                        "text-yellow-600") ||
                      (storageData.percentage > 80 && "text-[--error-color]")
                    }`}
                  >
                    {/* {parseFloat(storageOccupied).toFixed(2)}MB */}

                    {(() => {
                      const { value, unit } = calculation(storageData.occupied);
                      return `${value}${unit}`;
                    })()}
                  </p>
                  /{" "}
                  <p>
                    {(() => {
                      const { value, unit } = calculation(storageData.total);
                      return `${value}${unit}`;
                    })()}
                  </p>
                </h2>
              </span>
              <div className="w-full h-4 bg-[--default-text-color] rounded-2xl overflow-hidden mt-2">
                <div
                  className="h-full bg-[--accent-color] rounded-2xl transition-all duration-500 ease-in-out"
                  style={{ width: `${storageData.percentage}%` }}
                ></div>
              </div>
              <div className="text-center text-xl text-[--default-text-color] font-semibold">
                {storageData.percentage}%
              </div>

              <span
                className="my-3 shadow-custom inline-flex items-center w-full px-4 py-2 mt-1 text-base bg-[--error-color] text-[--default-text-color] transition duration-500 ease-in-out transform  rounded-lg cursor-pointer"
                onClick={handleLogout}
              >
                <MdLogout className="w-6 h-6" />
                <span className="ml-4 text-xl"> Logout</span>
              </span>
              <div className="flex items-center text-left p-3 bg-[--dark-gray-color] rounded-lg lg:absolute bottom-2">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block rounded-full h-9 w-9 select-none"
                      src={userDetails.imageUrl}
                      alt="User Image"
                      draggable={false}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-[--default-text-color]">
                      {userDetails.name}
                    </p>
                    <p className="text-xs font-medium text-indigo-200 group-hover:text-[--default-text-color]">
                      {userDetails.email}
                    </p>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div
        className={`flex flex-col flex-1 w-full overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? "md:relative" : "md:absolute h-full"
        }`}
      >
        <header className="w-full bg-[--bg-color] shadow text-[--text-color]">
          <div className="flex items-center justify-between p-4">
            <button
              className="rounded-lg focus:outline-none focus:shadow-outline"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* <button className="p-1 bg-gray-200 rounded-full">
                <FaBell className="w-6 h-6 text-gray-700" />
              </button>
              <button className="p-1 bg-gray-200 rounded-full">
                <FaPlus className="w-6 h-6 text-gray-700" />
              </button> */}
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col border-2 border-[--text-color] rounded-lg h-full transition-all duration-300">
          <div className="w-full h-full overflow-scroll mb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
};

export default Dashboard;
