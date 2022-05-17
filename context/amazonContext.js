import { createContext, useState, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";

export const AmazonContext = createContext();

export const AmazonProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [assets, setAssets] = useState([]);

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
