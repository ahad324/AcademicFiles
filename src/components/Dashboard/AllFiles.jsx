import React, { useEffect, useState } from "react";
import Table from "./Table";
import { useData } from "@contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
const AllFiles = () => {
  const { isAdmin } = useAuth();
  const { allFiles, teacherFiles } = useData();

  return isAdmin ? <Table files={allFiles} /> : <Table files={teacherFiles} />;
};

export default AllFiles;
