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
import Files from "../components/Dashboard/Files";
import Actions from "../components/Dashboard/Actions";
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
      <Route element={<PrivateRoutes />}>
        <Route
          path="/dashboard/"
          element={<Navigate to="/dashboard/overview" />}
        />
        <Route path="/dashboard/" element={<Dashboard />}>
          <Route path="overview" element={<Overview />} />
          <Route path="files" element={<Files />} />
          <Route
            path="actions/"
            element={<Navigate to="/dashboard/actions/createteacher" />}
          />
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
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default AppRoutes;
