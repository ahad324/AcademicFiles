import React, { useRef, useMemo, useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import { useData } from "@contexts/DataContext";
import { useAction } from "@contexts/ActionsContext";
// import { FaUsers, FaLink } from "react-icons/fa";
import { motion } from "framer-motion";
import CircularProgressBar from "./CircularProgressBar ";
import CountUp from "react-countup";
import { calculation } from "@utils/utils";

const Overview = () => {
  const ref = useRef();
  const { isAdmin } = useAuth();
  const { teachers, urlsByTeacher } = useAction();
  const { storageData, allFiles, teacherFiles, userDetails, getUserID } =
    useData();

  const [userUrlsCount, setUserUrlsCount] = useState(0);

  // Fetch user ID and calculate URLs for the user
  const getID = async () => {
    const id = await getUserID();
    if (urlsByTeacher[id]) {
      setUserUrlsCount(urlsByTeacher[id].length);
    }
  };

  useEffect(() => {
    getID();
  }, [urlsByTeacher]);
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
      <div className="text-[--text-color] text-center text-5xl p-6 rounded-lg">
        <h1 className="font-semibold">
          Welcome, {userDetails.name || "Guest"}!👋
        </h1>
        <p className="mt-2 text-lg">Here’s an overview of your dashboard.</p>
      </div>

      <div
        ref={ref}
        className="flex flex-col items-center justify-between md:h-screen "
      >
        <motion.div
          drag
          dragElastic={1}
          dragConstraints={ref}
          whileDrag={{ scale: 1.1, cursor: "grabbing", zIndex: "1" }}
          dragMomentum={true}
          dragTransition={{ bounceStiffness: 200, bounceDamping: 7 }}
          className="w-fit bg-[--card-bg] p-4 border-4 md:p-12 border-[--text-color] rounded-3xl shadow-custom backdrop-blur-3xl md:text-2xl"
          style={{ cursor: "grab" }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[--secondary-color]">
            Storage Information 📊
          </h3>
          <CircularProgressBar percentage={storageData.percentage} size={50} />
          <p className="mt-2 text-[--text-color]">
            Total Storage 💾:{" "}
            <span className="font-semibold">
              {(() => {
                const { value, unit } = calculation(storageData.total);
                return <CountUp startVal={0} end={value} suffix={unit} />;
              })()}
            </span>
          </p>
          <p className="text-[--text-color]">
            Storage Occupied 🗄️:{" "}
            <span className="font-semibold">
              {(() => {
                const { value, unit } = calculation(storageData.occupied);
                return <CountUp startVal={0} end={value} suffix={unit} />;
              })()}
            </span>
          </p>
        </motion.div>
        <section className="w-full flex justify-between items-center -translate-y-[340px] md:-translate-y-[550px]">
          <motion.div
            drag
            dragElastic={1}
            dragConstraints={ref}
            whileDrag={{ scale: 1.1, cursor: "grabbing", zIndex: "1" }}
            dragMomentum={true}
            dragTransition={{ bounceStiffness: 200, bounceDamping: 7 }}
            className="widget"
          >
            <p>Your Files 📁: </p>
            <span className="ml-2 font-semibold md:text-2xl">
              <CountUp startVal={0} end={teacherFiles.length} />
            </span>
          </motion.div>
          {isAdmin && (
            <motion.div
              drag
              dragElastic={1}
              dragConstraints={ref}
              whileDrag={{ scale: 1.1, cursor: "grabbing", zIndex: "1" }}
              dragMomentum={true}
              dragTransition={{ bounceStiffness: 200, bounceDamping: 7 }}
              className="widget"
            >
              <p>All Files 📦: </p>
              <span className="ml-2 font-semibold md:text-2xl">
                <CountUp startVal={0} end={allFiles.length} />
              </span>
            </motion.div>
          )}
        </section>
        <section className="w-full flex justify-around items-center -translate-y-0 flex-col md:-translate-y-[120%] md:flex-row">
          {isAdmin && (
            <>
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
                  <p>Teachers 👩‍🏫👨‍🏫:</p>
                </span>
                <span className="ml-2 font-semibold md:text-2xl">
                  <CountUp startVal={0} end={teacherCount} />
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
                <span className="flex justify-center items-center">
                  <p>All URL's 🔗:</p>
                </span>
                <span className="ml-2 font-semibold md:text-2xl">
                  <CountUp startVal={0} end={computedTotalUrls} />
                </span>
              </motion.div>
            </>
          )}

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
              <p>Your URL's 🔗:</p>
            </span>
            <span className="ml-2 font-semibold md:text-2xl">
              <CountUp startVal={0} end={userUrlsCount} />
            </span>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Overview;
