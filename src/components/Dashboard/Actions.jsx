import React from "react";
import { Outlet, NavLink, Navigate, useLocation } from "react-router-dom";
import { FaUserPlus, FaLink, FaUsers } from "react-icons/fa";
import "@src/styles/NavTabs.css"; // Make sure the path is correct
import { useAuth } from "../../contexts/AuthContext";

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
        <Navigate to="/dashboard/actions/createteacher" replace />
      )}
      {shouldRedirectTeacher && (
        <Navigate to="/dashboard/actions/createurl" replace />
      )}
      <nav className="border-b-4 border-[--text-color] p-2 flex flex-col sm:flex-row items-center justify-center">
        <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {isAdmin && (
            <li>
              <NavLink
                to="createteacher"
                className={({ isActive }) =>
                  `nav-link flex items-center ${
                    isActive ? "nav-link-active" : "nav-link-inactive"
                  }`
                }
              >
                <FaUserPlus className="Tabsicon" />
                <span className="ml-2">Create Teacher</span>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to="createurl"
              className={({ isActive }) =>
                `nav-link flex items-center ${
                  isActive ? "nav-link-active" : "nav-link-inactive"
                }`
              }
            >
              <FaLink className="Tabsicon" />
              <span className="ml-2">Create URL</span>
            </NavLink>
          </li>
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
              <FaUsers className="Tabsicon" />
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
