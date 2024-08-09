import React, { useEffect } from "react";
import Table from "./Table";
import { useData } from "@contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
const AllFiles = () => {
  const { isAdmin } = useAuth();
  const { allFiles, teacherFiles } = useData();
  const filesToRender = isAdmin ? allFiles : teacherFiles;

  return <Table files={filesToRender} />;
};

export default AllFiles;
