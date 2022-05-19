import React, { useContext } from "react";
import { AmazonContext } from "../context/amazonContext";
import Cards from "./Cards";
import Featured from "./Featured";
import Header from "./Header";

const Main = () => {
  const { recentTransactions } = useContext(AmazonContext);
  const styles = {
    container: `h-full w-full flex flex-col mt-[50px] pr-[50px] overflow-hidden`,
    recentTitle: `text-2xl font-bold text-center mb-[20px] text-center mt-[40px]`,
    recentTransactionsList: `flex flex-col`,
    transactionCard: `flex justify-between mb-[20px] p-[30px] bg-[#42667e] text-white rounded-xl shadow-xl font-bold gap-[20px] text-xl`,
  };
  console.log(recentTransactions);
  return (
    <div className={styles.container}>
      <Header />
      <Featured />
      <Cards />
      {recentTransactions.length > 0 && (
        <h1 className={styles.recentTitle}>Recent Transactions</h1>
      )}
      {recentTransactions &&
        recentTransactions.map((transaction, index) => {
          return (
            <div key={index} className={styles.recentTransactionsList}>
              <div className={styles.transactionCard}>
                <p>From: {transaction.attribute.from_address}</p>
                <p>To: {transaction.attribute.to_address}</p>
                <p>
                  Hash: {""}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://rinkeby.etherscan.io/tx/${transaction.attribute.hash}`}
                  >
                    {transaction.attribute.hash.slice(0, 10)}
                  </a>
                </p>
                <p>Gas: {transaction.attribute.gas}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Main;
