import React, { useRef, useMemo } from "react";
import { useData } from "@contexts/DataContext";
import { useAction } from "@contexts/ActionsContext";
import { FaUsers, FaLink } from "react-icons/fa";
import { motion } from "framer-motion";
import CircularProgressBar from "./CircularProgressBar ";

import { calculation } from "@utils/utils";

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
        className="flex flex-col items-center justify-between h-screen "
      >
        <motion.div
          drag
          dragElastic={1}
          dragConstraints={ref}
          whileDrag={{ scale: 1.1, cursor: "grabbing", zIndex: "1" }}
          dragMomentum={true}
          dragTransition={{ bounceStiffness: 200, bounceDamping: 7 }}
          className="w-fit bg-[--card-bg] p-12 border border-[--text-color] rounded-3xl shadow-custom backdrop-blur-3xl text-2xl"
          style={{ cursor: "grab" }}
        >
          <h3 className="text-3xl font-bold text-[--secondary-color]">
            Storage Information
          </h3>
          <CircularProgressBar percentage={storageData.percentage} size={50} />
          <p className="mt-2 text-[--text-color]">
            Total Storage:{" "}
            <span className="font-semibold">
              {(() => {
                const { value, unit } = calculation(storageData.total);
                return `${value}${unit}`;
              })()}
            </span>
          </p>
          <p className="text-[--text-color]">
            Storage Occupied:{" "}
            <span className="font-semibold">
              {(() => {
                const { value, unit } = calculation(storageData.occupied);
                return `${value}${unit}`;
              })()}
            </span>
          </p>
        </motion.div>
        <section className="w-full flex justify-between items-center -translate-y-[550px]">
          <motion.div
            drag
            dragElastic={1}
            dragConstraints={ref}
            whileDrag={{ scale: 1.1, cursor: "grabbing", zIndex: "1" }}
            dragMomentum={true}
            dragTransition={{ bounceStiffness: 200, bounceDamping: 7 }}
            className="widget"
          >
            <p>Your Files Count: </p>
            <span className="ml-2 font-semibold text-2xl">
              {teacherFiles.length}
            </span>
          </motion.div>
          <motion.div
            drag
            dragElastic={1}
            dragConstraints={ref}
            whileDrag={{ scale: 1.1, cursor: "grabbing", zIndex: "1" }}
            dragMomentum={true}
            dragTransition={{ bounceStiffness: 200, bounceDamping: 7 }}
            className="widget"
          >
            <p>All Files Count: </p>
            <span className="ml-2 font-semibold text-2xl">
              {allFiles.length}
            </span>
          </motion.div>
        </section>
        <section className="w-full flex justify-around items-center -translate-y-[120%]">
          <motion.div
            drag
            dragElastic={1}
            dragConstraints={ref}
            whileDrag={{ scale: 1.1, cursor: "grabbing", zIndex: "1" }}
            dragMomentum={true}
            dragTransition={{ bounceStiffness: 200, bounceDamping: 7 }}
            className="widget"
          >
            <span className="flex justify-center items-center">
              <FaUsers size="2em" />
              <p className="ml-1 mr-2">Teachers:</p>
            </span>
            <span className="font-semibold text-2xl">{teacherCount}</span>
          </motion.div>

          <motion.div
            drag
            dragElastic={1}
            dragConstraints={ref}
            whileDrag={{ scale: 1.1, cursor: "grabbing", zIndex: "1" }}
            dragMomentum={true}
            dragTransition={{ bounceStiffness: 200, bounceDamping: 7 }}
            className="widget"
          >
            <span className="flex justify-center items-center">
              <FaLink size="2em" />
              <p className="ml-1 mr-2">URL's Count:</p>
            </span>
            <span className="font-semibold text-2xl">{computedTotalUrls}</span>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Overview;
