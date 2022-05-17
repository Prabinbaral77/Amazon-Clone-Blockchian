require("@nomiclabs/hardhat-waffle");

const ALCHEMY_PRIVATE_KEY = "FZlJbYEIzBr2rAbrmQysRsg76SrICRAr";
const RINKEBY_PRIVATE_KEY =
  "dc63aaad7b9b396358331a9bad2fc11433d502e47f28c2e33cffe48c7c9e021c";
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_PRIVATE_KEY}`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`],
    },
  },
};
