import React, { useContext, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { AmazonContext } from "../context/amazonContext";
import { HashLoader } from "react-spinners";
import Link from "next/link";

const BuyModal = ({ close }) => {
  const styles = {
    container: `h-full w-full flex flex-col`,
    closeX: `w-full h-[50px] flex items-center justify-end mb-[20px]`,
    title: `text-3xl font-bold flex flex-1 items-center mt-[20px] justify-center mb-[40px]`,
    content: `flex w-full mb-[30px] text-xl justify-center`,
    input: `w-[50%] h-[50px]  bg-[#f7f6f2] rounded-lg p-[10px] flex mx-auto`,
    inputBox: `w-full h-full flex items-center justify-center bg-[#f7f6f2] focus:outline-none`,
    price: `q-full h-full flex items-center justify-center mt-[20px] font-bold text-3xl`,
    buyBtn: `w-[20%] h-[50px] bg-[#000] mt-[40px] rounded-lg p-[10px] flex mx-auto text-white justify-center items-center cursor-pointer`,
    loaderContainer: `w-full h-[500px] flex items-center justify-center`,
    etherScan: `w-full h-full flex items-center justify-center text-green-500 text-2xl mt-[20px] font-bold cursor-pointer`,
    success: `w-full h-full flex items-center justify-center text-xl  mt-[20px] font-bolder`,
  };
  const {
    amountDue,
    setAmountDue,
    tokenAmount,
    setTokenAmount,
    isLoading,
    setIsLoading,
    etherScanLink,
    setEtherScanLink,
    buyToken,
  } = useContext(AmazonContext);

  useEffect(() => {
    calculatePrice();
  }, [tokenAmount]);

  const calculatePrice = () => {
    const price = parseFloat(tokenAmount * 0.0001);
    price = price.toFixed(4);
    setAmountDue(price);
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <>
          <div className={styles.loaderContainer}>
            <HashLoader size={80} />
          </div>
        </>
      ) : (
        <>
          <div className={styles.closeX}>
            <IoIosClose
              size={50}
              onClick={() => {
                close();
                setEtherScanLink("");
                setTokenAmount("");
                setAmountDue("");
              }}
              className="cursor-pointer"
            />
          </div>
          <div className={styles.title}>Buy More Amazon Coin Here.</div>
          <div className={styles.content}>
            Select How many token you want to buy.
          </div>
          <div className={styles.input}>
            <input
              type="text"
              placeholder="amount"
              onChange={(e) => setTokenAmount(e.target.value)}
              value={tokenAmount}
              className={styles.inputBox}
            />
          </div>
          <div className={styles.price}>
            Total Due: {""}
            {tokenAmount && tokenAmount > 0 ? amountDue + "ETH" : "0 ETH"}
          </div>
          <button
            className={styles.buyBtn}
            onClick={() => {
              setIsLoading(true);
              buyToken();
            }}
          >
            Buy
          </button>
          {etherScanLink && (
            <>
              <div className={styles.success}>
                Transaction successful! Checkout your receipt for your
                transactions below.
              </div>
              <Link href={etherScanLink} className={styles.etherScan}>
                <a className={styles.etherScan} target="_blank">
                  Transaction receipt
                </a>
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BuyModal;
