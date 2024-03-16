import { ethers } from "ethers";

const apefulAbi = require("./abis/apeful.json");

require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider("https://testnet.galadriel.com/");
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

  const nftAddress = process.env.APEFUL_DEPLOYMENT_ADDRESS!;
  const nftContract = new ethers.Contract(nftAddress, apefulAbi, wallet);

  const result = await nftContract.setTokenRouterAddress(
    process.env.GALADRIEL_TOKEN_ROUTER_ADDRESS!
  );
  console.log(result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
