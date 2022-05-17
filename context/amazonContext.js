// JxXDL99S2yYq9Ce
import { createContext, useState, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { amazonCoinAddress, amazonAbi } from "../lib/constants";
import { ethers } from "ethers";

export const AmazonContext = createContext();

export const AmazonProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [assets, setAssets] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [etherScanLink, setEtherScanLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState("");

  const {
    authenticate,
    isAuthenticated,
    enableWeb3,
    Moralis,
    user,
    isWeb3Enabled,
  } = useMoralis();

  const {
    data: assetsData,
    error: assetsDataError,
    isLoading: assetsDataIsLoading,
  } = useMoralisQuery("assets");

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const currentUserName = await user?.get("nickname");
        setUsername(currentUserName);
      }
    })();
  }, [isAuthenticated, user, username]);

  useEffect(() => {
    const getAssets = async () => {
      try {
        await enableWeb3();
        setAssets(assetsData);
      } catch (error) {
        console.log(error);
      }
    };
    (async () => {
      if (isWeb3Enabled) {
        await getAssets();
      }
    })();
  }, [assetsData, isWeb3Enabled, assetsDataIsLoading]);

  const handleSetUsername = () => {
    if (user) {
      if (nickname) {
        user.set("nickname", nickname);
        user.save();
        setNickname("");
      } else {
        console.log("can`t set the empty nickname.");
      }
    } else {
      console.log("no user");
    }
  };

  const getBalance = async () => {
    try {
      if (!isAuthenticated || !currentAccount) return;
      const options = {
        contractAddress: amazonCoinAddress,
        functionName: "balanceOf",
        abi: amazonAbi,
        params: {
          account: currentAccount,
        },
      };

      if (isWeb3Enabled) {
        const response = await Moralis.executeFunction(options);
        setBalance(response.toString());
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };

  const buyToken = async () => {};

  return (
    <AmazonContext.Provider
      value={{
        isAuthenticated,
        username,
        handleSetUsername,
        nickname,
        setNickname,
        assets,
      }}
    >
      {children}
    </AmazonContext.Provider>
  );
};
