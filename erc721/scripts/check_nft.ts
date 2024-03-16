import { ethers, AbiCoder } from "ethers";

const apefulAbi = require("./abis/apeful.json");
const mailboxAbi = require("./abis/mailbox.json");

require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider("https://testnet.galadriel.com/");
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

  const nftAddress = process.env.APEFUL_DEPLOYMENT_ADDRESS!;
  const nftContract = new ethers.Contract(nftAddress, apefulAbi, wallet);

  // console.log(await nftContract.tokenURI(0));

  // console.log(await nftContract.ownerOf(0));
  // console.log(await nftContract.setApproval());
  // console.log(
  //   await nftContract.bridgeToSepolia(
  //     0,
  //     "0x2C23d4a3b26255C356A7BAf95175097cFB84D497"
  //   )
  // );

  console.log(await nftContract.setBridgingEnabled(false));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
