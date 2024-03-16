import { ethers } from "ethers";

const apefulAbi = require("./abis/apeful.json");

require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider("https://testnet.galadriel.com/");
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

  const nftAddress = "0x6c468BbD8b86a3b3B240E31e3BA9E0A4f2DB03BF";
  const nftContract = new ethers.Contract(nftAddress, apefulAbi, wallet);

  const result = await nftContract.initializeMint(" with a golden background");
  const txHash = result.hash;

  let logCount = 0;
  let logs = undefined;

  while (logCount === 0) {
    await new Promise((res) => setTimeout(res, 2000));

    const logsRequest = await fetch(
      "https://api.tryethernal.com/api/transactions/" +
        txHash +
        "/logs?firebaseUserId=aLfnmocM99SAMCh6KkQTp1CVySE3&workspace=Galadriel&page=1&itemsPerPage=20"
    );
    logs = await logsRequest.json();
    console.log(logs);
    logCount = logs.count;
  }
  const event = nftContract.interface.parseLog(logs.logs[1]);
  const newNftId = event!.args[1].toString();

  //   console.log(event);
  console.log("nft id: ", newNftId);

  let tokenUri = undefined;

  while (!tokenUri) {
    await new Promise((res) => setTimeout(res, 2000));

    try {
      tokenUri = await nftContract.tokenURI(newNftId);
      console.log("uri available: ", tokenUri);
    } catch (e) {
      console.log("tokenUri not available, yet");
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
