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

  const {
    data: userData,
    error: userDataError,
    isLoading: userDataIsLoading,
  } = useMoralisQuery("_User");

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
    }
  };

  const buyAsset = async (price, asset) => {
    try {
      if (!isAuthenticated) return;

      const options = {
        type: "erc20",
        amount: price,
        receiver: amazonCoinAddress,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const buyToken = async () => {
    if (!isAuthenticated) {
      await authenticate();
    }

    const amount = ethers.BigNumber.from(tokenAmount);
    const price = ethers.BigNumber.from("100000000000000");
    const calcPrice = amount.mul(price);

    let options = {
      contractAddress: amazonCoinAddress,
      functionName: "mint",
      abi: amazonAbi,
      msgValue: calcPrice,
      params: {
        amount,
      },
    };

    const transactions = await Moralis.executeFunction(options);
    const receipt = await transactions.wait(4);
    setIsLoading(false);
    console.log(receipt);
    setEtherScanLink(
      `https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`
    );
  };

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        await getBalance();
        const currentUserName = await user?.get("nickname");
        setUsername(currentUserName);
        const account = await user?.get("ethAddress");
        setCurrentAccount(account);
      }
    })();
  }, [isAuthenticated, user, username, currentAccount]);

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

  return (
    <AmazonContext.Provider
      value={{
        isAuthenticated,
        username,
        handleSetUsername,
        nickname,
        setNickname,
        assets,
        balance,
        getBalance,
        tokenAmount,
        setTokenAmount,
        isLoading,
        setIsLoading,
        setEtherScanLink,
        etherScanLink,
        currentAccount,
        buyToken,
        amountDue,
        setAmountDue,
      }}
    >
      {children}
    </AmazonContext.Provider>
  );
};
