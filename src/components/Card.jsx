import React, { useEffect, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "./Loader";

const Card = ({ data, reference }) => {
  const [loading, setloading] = useState(true);
  useEffect(() => {
    setloading(false);
  }, []);

  return (
    <motion.div
      drag
      dragElastic={1}
      dragConstraints={reference}
      whileDrag={{ scale: 1.1, cursor: "grabbing" }}
      dragMomentum={true}
      dragTransition={{ bounceStiffness: 200, bounceDamping: 7 }}
      className="card"
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <FaRegFileAlt />
          <p
            className="text-sm leading-tight mt-5 font-semibold overflow-hidden text-pretty whitespace-nowrap"
            title={data.desc}
          >
            {data.desc}
          </p>
          <div className="footer absolute bottom-0 w-full left-0">
            <div className="flex items-center justify-between py-3 px-8 mb-3">
              <h5>{data.filesize}</h5>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Card;
