import React from "react";
import { Outlet, NavLink, Navigate, useLocation } from "react-router-dom";
import { FaUsers, FaNetworkWired } from "react-icons/fa";
import "@src/styles/NavTabs.css";
import { useAuth } from "@contexts/AuthContext";

const Actions = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  const shouldRedirectAdmin =
    isAdmin && location.pathname === "/dashboard/actions";
  const shouldRedirectTeacher =
    !isAdmin && location.pathname === "/dashboard/actions";
  return (
    <div className="p-4">
      {shouldRedirectAdmin && (
        <Navigate to="/dashboard/actions/allteachers" replace />
      )}
      {shouldRedirectTeacher && (
        <Navigate to="/dashboard/actions/allurls" replace />
      )}
      <nav className="border-4 rounded-3xl shadow-custom overflow-auto border-[--text-color] p-2 flex items-center justify-center w-fit m-auto">
        <ul className="flex flex-col justify-center items-center sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {isAdmin && (
            <li>
              <NavLink
                to="allteachers"
                className={({ isActive }) =>
                  `nav-link flex items-center ${
                    isActive ? "nav-link-active" : "nav-link-inactive"
                  }`
                }
              >
                <FaUsers className="Tabsicon" />
                <span className="ml-2">View All Teachers</span>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to="allurls"
              className={({ isActive }) =>
                `nav-link flex items-center ${
                  isActive ? "nav-link-active" : "nav-link-inactive"
                }`
              }
            >
              <FaNetworkWired className="Tabsicon" />
              <span className="ml-2">View All URLs</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Actions;
