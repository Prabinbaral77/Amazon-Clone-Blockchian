import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import History from "../components/History";

const history = () => {
  const styles = {
    container: `h-full w-full flex  bg-[#fff]`,
  };
  return (
    <div className={styles.container}>
      <Sidebar />
      <History />
    </div>
  );
};

export default history;
