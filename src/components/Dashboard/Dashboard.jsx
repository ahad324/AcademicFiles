import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
// Icons Imports
import {
  FaBars,
  FaTimes,
  FaChartBar,
  FaCogs,
  FaClipboardList,
  FaTrashAlt,
  FaTools,
  FaTasks,
} from "react-icons/fa"; // Import icons from react-icons
import { AiOutlineFile } from "react-icons/ai";
import { IoMdCloudDownload } from "react-icons/io";
import { MdLogout } from "react-icons/md";

import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { handleLogout } = useAuth();

  const {
    APP_NAME,
    data,
    storageOccupied,
    storageTotal,
    downloadAllFiles,
    deleteAllFiles,
  } = useData();

  const percentageUsed = (parseFloat(storageOccupied) / storageTotal) * 100;
  const formattedPercentage = percentageUsed.toFixed(2);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
                      `inline-flex items-center w-full px-4 py-2 mt-1 text-base transition duration-500 ease-in-out transform rounded-lg ${
                        isActive
                          ? "bg-indigo-500 text-white"
                          : "text-[--default-text-color] hover:bg-indigo-500"
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
                          : "text-[--default-text-color] hover:bg-indigo-500"
                      }`
                    }
                    to="files"
                  >
                    <AiOutlineFile className="w-4 h-4" />
                    <span className="ml-4">All Files </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `inline-flex items-center w-full px-4 py-2 mt-1 text-base transition duration-500 ease-in-out transform rounded-lg ${
                        isActive
                          ? "bg-indigo-500 text-white"
                          : "text-[--default-text-color] hover:bg-indigo-500"
                      }`
                    }
                    to="actions"
                  >
                    <FaTools className="w-4 h-4" />
                    <span className="ml-4">Actions</span>
                  </NavLink>
                </li>
                <li>
                  <a
                    className="inline-flex items-center w-full px-4 py-2 mt-1 text-base text-[--default-text-color] transition duration-500 ease-in-out transform border-indigo-800 rounded-lg hover:border-indigo-800 focus:shadow-outline hover:bg-[--secondary-color-hover]"
                    href="#"
                  >
                    <FaCogs className="w-4 h-4" />
                    <span className="ml-4">Settings</span>
                  </a>
                </li>
              </ul>
              <p className="px-4 pt-4 font-medium text-[--default-text-color] uppercase">
                Shortcuts
              </p>
              <ul>
                <li>
                  <a
                    className="inline-flex items-center w-full px-4 py-2 mt-1 text-base text-[--default-text-color] transition duration-500 ease-in-out transform border-indigo-800 rounded-lg hover:border-indigo-800 focus:shadow-outline hover:bg-[--secondary-color-hover]"
                    href="#"
                  >
                    <FaTasks className="w-4 h-4" />
                    <span className="ml-4"> Tasks</span>
                  </a>
                </li>
                <li>
                  <a
                    className="inline-flex items-center w-full px-4 py-2 mt-1 text-base text-[--default-text-color] transition duration-500 ease-in-out transform border-indigo-800 rounded-lg hover:border-indigo-800 focus:shadow-outline hover:bg-[--secondary-color-hover]"
                    href="#"
                  >
                    <FaClipboardList className="w-4 h-4" />
                    <span className="ml-4">Reports</span>
                  </a>
                </li>
                <li>
                  <a
                    className="inline-flex items-center w-full px-4 py-2 mt-1 text-base text-[--default-text-color] transition duration-500 ease-in-out transform border-indigo-800 rounded-lg hover:border-indigo-800 focus:shadow-outline hover:bg-[--secondary-color-hover]"
                    href="#"
                  >
                    <FaTools className="w-4 h-4" />
                    <span className="ml-4"> Tools</span>
                  </a>
                </li>
                <li>
                  <button
                    className="inline-flex items-center w-full px-4 py-2 mt-1 text-base text-[--default-text-color] transition duration-500 ease-in-out transform border-indigo-800 rounded-lg hover:border-indigo-800 focus:shadow-outline hover:bg-[--secondary-color-hover]"
                    onClick={downloadAllFiles}
                  >
                    <IoMdCloudDownload className="w-4 h-4" />
                    <span className="ml-4"> Download All Files</span>
                    <span className="absolute bottom-2.1 right-2 w-5 h-5 bg-[--error-color] text-[--default-text-color] rounded-full flex items-center justify-center text-xs">
                      {data.length}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    className="inline-flex items-center w-full px-4 py-2 mt-1 text-base text-[--default-text-color] transition duration-500 ease-in-out transform border-indigo-800 rounded-lg hover:border-indigo-800 focus:shadow-outline hover:bg-[--error-color]"
                    onClick={deleteAllFiles}
                  >
                    <FaTrashAlt className="w-4 h-4" />
                    <span className="ml-4"> Delete All Files</span>
                    <span className="absolute bottom-2.1 right-2 w-5 h-5 bg-[--error-color] text-[--default-text-color] rounded-full flex items-center justify-center text-xs">
                      {data.length}
                    </span>
                  </button>
                </li>
              </ul>
              <span className="px-4 pt-4 font-medium text-[--default-text-color] uppercase">
                <p>Storage</p>
                <h2 className="px-1 py-1 rounded-lg bg-[--default-text-color] text-[--accent-color] text-sm font-semibold w-fit flex ">
                  <p
                    className={`${
                      (formattedPercentage >= 50 &&
                        formattedPercentage <= 80 &&
                        "text-yellow-600") ||
                      (formattedPercentage > 80 && "text-[--error-color]")
                    }`}
                  >
                    {parseFloat(storageOccupied).toFixed(2)}MB
                  </p>
                  /{" "}
                  <p>
                    {storageTotal}
                    MB
                  </p>
                </h2>
              </span>
              <div className="w-full h-4 bg-[--default-text-color] rounded-2xl overflow-hidden mt-2">
                <div
                  className="h-full bg-[--accent-color] rounded-2xl transition-all duration-500 ease-in-out"
                  style={{ width: `${formattedPercentage}%` }}
                ></div>
              </div>
              <div className="text-center text-xl text-[--default-text-color] font-semibold">
                {formattedPercentage}%
              </div>

              <span
                className="my-3 shadow-custom inline-flex items-center w-full px-4 py-2 mt-1 text-base bg-[--error-color] text-[--default-text-color] transition duration-500 ease-in-out transform border-indigo-800 rounded-lg cursor-pointer"
                onClick={handleLogout}
              >
                <MdLogout className="w-6 h-6" />
                <span className="ml-4 text-xl"> Logout</span>
              </span>
              <div className="flex-shrink-0 p-4 px-4 bg-[--secondary-color-hover]">
                <a href="#" className="flex-shrink-0 block w-full group">
                  <div className="flex items-center">
                    <div>
                      <img
                        className="inline-block rounded-full h-9 w-9"
                        src="https://avatars.githubusercontent.com/u/106489451?v=4"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-[--default-text-color]">
                        Tom Cook
                      </p>
                      <p className="text-xs font-medium text-indigo-200 group-hover:text-[--default-text-color]">
                        View profile
                      </p>
                    </div>
                  </div>
                </a>
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
        <main className="flex-1 flex flex-col border-2 border-[--text-color] h-full transition-all duration-300">
          <div className="w-full h-full overflow-scroll">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
};

export default Dashboard;
