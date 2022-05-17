import React, { useContext } from "react";
import Card from "./Card";
import { AmazonContext } from "../context/amazonContext";

const Cards = () => {
  const styles = {
    container: `h-full w-full flex flex-col ml-[20px] -mt-[50px]`,
    title: `text-xl font-bolder mb-[20px] mt-[30px]  ml-[30px]`,
    cards: `flex items-center  flex-wrap gap-[80px]`,
  };

  const { assets } = useContext(AmazonContext);

  const item = {
    id: 0,
    attributes: {
      name: "Doge",
      amount: 5,
      src: "https://brand.assets.adidas.com/f_auto,q_auto,fl_lossy/capi/enUS/Images/2021/12/metaverse-blog-image-bayc_221-825942.png",
    },
  };
  return (
    <div className={styles.container}>
      <div className={styles.title}>New Release</div>
      <div className={styles.cards}>
        {assets.map((asset) => {
          return <Card key={asset.id} item={asset.attributes} />;
        })}
      </div>
    </div>
  );
};

export default Cards;
