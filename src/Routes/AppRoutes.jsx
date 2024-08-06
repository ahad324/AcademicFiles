import React from "react";
import { Routes, Route } from "react-router-dom";
import Background from "../components/Background";
import Foreground from "../components/Foreground";
import Login from "../Auth/Login";
import Error from "../components/Error/Error";
import PrivateRoutes from "./PrivateRoutes";

import Dashboard from "../components/Dashboard/Dashboard";
// Dashboard Components
import Overview from "../components/Dashboard/Overview";
import Files from "../components/Dashboard/Files";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <section>
            <Background />
            <Foreground />
          </section>
        }
      />
      <Route element={<PrivateRoutes />}>
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="overview" element={<Overview />} />
          <Route path="files" element={<Files />} />
        </Route>
        {/* Add other role-based routes here */}
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default AppRoutes;
