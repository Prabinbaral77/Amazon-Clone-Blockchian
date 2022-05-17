const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const AmazonCoin = await hre.ethers.getContractFactory("AmazonCoin");
  const amazonCoin = await AmazonCoin.deploy();

  await amazonCoin.deployed();

  console.log("AmazonCOin deployed to:", amazonCoin.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
