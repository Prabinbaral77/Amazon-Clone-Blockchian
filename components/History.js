import React, { useContext } from "react";
import { AmazonContext } from "../context/amazonContext";
import Header from "./Header";
import Transactions from "./Transactions";

const History = () => {
  const styles = {
    main: `w-full h-full flex flex-col mt-[50px]`,
    tableContainer: `w-full h-full flex flex-col p-[100px] justify-center`,
    pageTitle: `text-2xl font-bold text-left mt-[50px] mb-[30px]`,
    transactions: `flex gap-[50px] flex-row flex-wrap`,
  };
  const { ownedItems } = useContext(AmazonContext);
  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.tableContainer}>
        {ownedItems ? (
          <div className={styles.pageTitle}>Purchase History</div>
        ) : (
          <div className={styles.pageTitle}>No Purchase History!</div>
        )}

        <div className={styles.transactions}>
          {ownedItems &&
            ownedItems.map((item, index) => {
              return <Transactions key={index} item={item} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default History;
