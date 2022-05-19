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
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [ownedItems, setOwnedItems] = useState([]);

  const {
    authenticate,
    isAuthenticated,
    enableWeb3,
    Moralis,
    user,
    isWeb3Enabled,
    isInitialized,
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

  const listenToUpdate = async () => {
    console.log("Listenning");
    let query = new Moralis.Query("EthTransactions");
    let subscription = await query.subscribe();
    subscription.on("update", async (object) => {
      console.log("NEw transactions");
      console.log(object);
      setRecentTransactions([object]);
    });
  };

  const getOwnedAssets = async () => {
    try {
      if (userData[0].attributes.ownerAsset) {
        setOwnedItems((prevItems) => [
          ...prevItems,
          userData[0].attributes.ownerAsset,
        ]);
      }
    } catch (error) {
      console.log(error);
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
        console.log(response.toString());
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
        contractAddress: amazonCoinAddress,
      };

      let transaction = await Moralis.transfer(options);
      const receipt = await transaction.wait();

      if (receipt) {
        const res = userData[0].add("ownerAsset", {
          ...asset,
          purchaseDate: Date.now(),
          etherScanLink: `https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`,
        });

        await res.save().then(() => {
          alert("You have successfully purchased this asset!");
        });
      }
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
      if (isInitialized) {
        await listenToUpdate();
      }
      if (isAuthenticated) {
        await getBalance();
        const currentUserName = await user?.get("nickname");
        setUsername(currentUserName);
        const account = await user?.get("ethAddress");
        setCurrentAccount(account);
      }
    })();
  }, [isAuthenticated, user, username, currentAccount, listenToUpdate]);

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
        await getOwnedAssets();
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
        buyAsset,
        recentTransactions,
        ownedItems,
      }}
    >
      {children}
    </AmazonContext.Provider>
  );
};
