import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Foreground from "./Foreground";
import Background from "./Background";
import InvalidIDError from "./InvalidIDError";
import Loader from "./Loader";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { id } = useParams();
  const { checkIDInDatabase } = useData();
  const [isValidID, setIsValidID] = useState(null);
  const { User } = useAuth();

  useEffect(() => {
    const verifyID = async () => {
      const isValid = await checkIDInDatabase(id);
      setIsValidID(isValid);
    };

    verifyID();
  }, [id]);

  if (isValidID === null) {
    return <Loader />;
  }

  if (!isValidID) {
    return <InvalidIDError message={`ID ${id} not found`} />;
  }

  return (
    <>
      {User && <Navigate to="/dashboard" />}
      <section className="w-full h-full">
        <div className="text-[--default-text-color] text-center font-semibold py-6 border-b-4 border-[--text-color] shadow-custom bg-[--secondary-color] rounded-b-3xl  backdrop-blur-3xl fixed top-0 z-[3] w-full">
          <span className="bg-black p-4 rounded-lg shadow-custom border">
            Receiving Files for ID : {id}
          </span>
        </div>
        <Background />
        <Foreground urlID={id} />
      </section>
    </>
  );
};

export default Home;
