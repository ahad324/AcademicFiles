import React, { useRef, useMemo } from "react";
import { useData } from "@contexts/DataContext";
import { useAction } from "@contexts/ActionsContext";
import { FaUsers, FaLink } from "react-icons/fa";
import { motion } from "framer-motion";
import { calculation } from "../../utils/utils";

const Overview = () => {
  const ref = useRef();
  const { teachers, urlsByTeacher } = useAction();
  const { storageData, allFiles, teacherFiles, userDetails } = useData();

  // Memoize the computation of total URLs
  const computedTotalUrls = useMemo(
    () =>
      Object.values(urlsByTeacher).reduce(
        (total, urls) => total + urls.length,
        0
      ),
    [urlsByTeacher]
  );

  // Memoize the count of teachers
  const teacherCount = useMemo(() => teachers.length, [teachers]);

  return (
    <div className="p-6 text-[--text-color] rounded-lg shadow-custom bg-[--bg-color] h-fit min-h-screen flex flex-col space-y-6">
      <div className="bg-[--accent-color] border border-[--text-color] text-[--default-text-color] text-center text-3xl p-6 rounded-lg shadow-md">
        <h1 className="font-semibold">
          Welcome, {userDetails.name || "Guest"}!
        </h1>
        <p className="mt-2 text-lg">Here’s an overview of your dashboard.</p>
      </div>

      <h2 className="text-3xl font-semibold text-[--text-color]">Overview</h2>

      <div
        ref={ref}
        className="grid justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div
          drag
          dragElastic={1}
          dragConstraints={ref}
          whileDrag={{ scale: 1.1, cursor: "grabbing" }}
          dragMomentum={true}
          dragTransition={{ bounceStiffness: 200, bounceDamping: 7 }}
          className="card "
        >
          <h3 className="text-2xl font-semibold text-[--secondary-color]">
            Storage Information
          </h3>
          <p className="text-[--medium-gray-color] mt-2">
            Total Storage:{" "}
            <span className="font-semibold">
              {(() => {
                const { value, unit } = calculation(storageData.total);
                return `${value}${unit}`;
              })()}
            </span>
          </p>
          <p className="text-[--medium-gray-color]">
            Storage Occupied:{" "}
            <span className="font-semibold">
              {(() => {
                const { value, unit } = calculation(storageData.occupied);
                return `${value}${unit}`;
              })()}
            </span>
          </p>
          <p className="text-[--medium-gray-color]">
            Percentage Used:{" "}
            <span className="font-semibold">{storageData.percentage}%</span>
          </p>
        </motion.div>

        <motion.div
          drag
          dragElastic={1}
          dragConstraints={ref}
          whileDrag={{ scale: 1.1, cursor: "grabbing" }}
          dragMomentum={true}
          dragTransition={{ bounceStiffness: 200, bounceDamping: 7 }}
          className="card"
        >
          <h3 className="text-2xl font-semibold text-[--secondary-color] ">
            Files Summary
          </h3>
          <p className="text-[--medium-gray-color] mt-2">
            All Files Count:{" "}
            <span className="font-semibold">{allFiles.length}</span>
          </p>
          <p className="text-[--medium-gray-color]">
            Your Files Count:{" "}
            <span className="font-semibold">{teacherFiles.length}</span>
          </p>
        </motion.div>

        <motion.div
          drag
          dragElastic={1}
          dragConstraints={ref}
          whileDrag={{ scale: 1.1, cursor: "grabbing" }}
          dragMomentum={true}
          dragTransition={{ bounceStiffness: 200, bounceDamping: 7 }}
          className="card"
        >
          <FaUsers size="3em" className="text-[--accent-color]" />
          <h3 className="text-xl font-semibold text-[--secondary-color] mt-4">
            Teachers Count
          </h3>
          <p className="text-[--medium-gray-color] text-[80px] flex items-center justify-center font-semibold">
            {teacherCount}
          </p>
        </motion.div>

        <motion.div
          drag
          dragElastic={1}
          dragConstraints={ref}
          whileDrag={{ scale: 1.1, cursor: "grabbing" }}
          dragMomentum={true}
          dragTransition={{ bounceStiffness: 200, bounceDamping: 7 }}
          className="card"
        >
          <FaLink size="3em" className="text-[--accent-color]" />
          <h3 className="text-2xl font-semibold text-[--secondary-color] mt-4">
            URLs Count
          </h3>
          <p className="text-[--medium-gray-color] text-[80px] flex items-center justify-center">
            {computedTotalUrls}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;
