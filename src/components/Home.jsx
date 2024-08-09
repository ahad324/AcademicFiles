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
        <h1>Recieving Files for ID : {id}</h1>
        <Background />
        <Foreground urlID={id.toString()} />
      </section>
    </>
  );
};

export default Home;
