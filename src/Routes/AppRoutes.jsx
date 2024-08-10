import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../components/Home";
import InvalidIDError from "../components/InvalidIDError";

import Login from "../Auth/Login";
import Error from "../components/Error/Error";
import PrivateRoutes from "./PrivateRoutes";

import Dashboard from "../components/Dashboard/Dashboard";
// Dashboard Components
import Overview from "../components/Dashboard/Overview";
import AllFiles from "../components/Dashboard/AllFiles";
import Actions from "../components/Dashboard/Actions";
import Settings from "../components/Dashboard/Settings";
// Actions Components
import { ActionsProvider } from "../contexts/ActionsContext";
import CreateTeacher from "../components/Dashboard/Actions/CreateTeacher";
import CreateURL from "../components/Dashboard/Actions/CreateURL";
import AllTeachers from "../components/Dashboard/Actions/AllTeachers";
import AllURLs from "../components/Dashboard/Actions/AllURLs";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InvalidIDError />} />
      <Route path="/:id" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoutes />}>
        <Route
          path="/dashboard/"
          element={<Navigate to="/dashboard/overview" />}
        />
        <Route path="/dashboard/" element={<Dashboard />}>
          <Route
            path="overview"
            element={
              <ActionsProvider>
                {" "}
                <Overview />
              </ActionsProvider>
            }
          />
          <Route path="allfiles" element={<AllFiles />} />
          <Route
            path="actions/"
            element={
              <ActionsProvider>
                <Actions />
              </ActionsProvider>
            }
          >
            <Route path="createteacher" element={<CreateTeacher />} />
            <Route path="createurl" element={<CreateURL />} />
            <Route path="allteachers" element={<AllTeachers />} />
            <Route path="allurls" element={<AllURLs />} />
          </Route>
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default AppRoutes;
