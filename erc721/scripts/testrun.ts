import { ethers, AbiCoder } from "ethers";

const apefulAbi = require("./abis/apeful.json");
const mailboxAbi = require("./abis/mailbox.json");

require("dotenv").config();

async function main() {
  const sepoliaProvider = new ethers.JsonRpcProvider(
    "https://eth-sepolia-public.unifra.io"
  );
  const sepoliaWallet = new ethers.Wallet(
    process.env.DEPLOYER_PRIVATE_KEY!,
    sepoliaProvider
  );

  const galadrielProvider = new ethers.JsonRpcProvider(
    "https://testnet.galadriel.com/"
  );
  const galadrielWallet = new ethers.Wallet(
    process.env.DEPLOYER_PRIVATE_KEY!,
    galadrielProvider
  );

  const nftAddress = process.env.APEFUL_DEPLOYMENT_ADDRESS!;
  const nftContract = new ethers.Contract(
    nftAddress,
    apefulAbi,
    galadrielWallet
  );

  // console.log("minted NFTs:", await nftContract.totalSupply());

  const sepoliaMailboxAddress = process.env.SEPOLIA_MAILBOX_ADDRESS!;
  const sepoliaMailboxContract = new ethers.Contract(
    sepoliaMailboxAddress,
    mailboxAbi,
    sepoliaWallet
  );

  const galadrielMailboxAddress = "0xF1ee40A37667e6872342Fd57D192a2f0414Dc403";
  const galadrielMailboxContract = new ethers.Contract(
    galadrielMailboxAddress,
    mailboxAbi,
    galadrielWallet
  );

  //
  // create sepolia message to send through hyperlane
  //

  const abi = AbiCoder.defaultAbiCoder();
  const params = abi.encode(
    ["address", "string"], // encode as address array
    [process.env.DEPLOYER_PUBLIC_KEY!, " with a cool cyberpunk Background"]
  );

  //
  // sending the message
  //

  const recipient =
    "0x000000000000000000000000" +
    process.env.APEFUL_DEPLOYMENT_ADDRESS!.slice(2);
  // console.log(recipient);

  const actSepoliaBlock = await sepoliaProvider.getBlockNumber();
  const actGaladrielBlock = await galadrielProvider.getBlockNumber();
  console.log("actSepoliaBlock", actSepoliaBlock);

  const result = await sepoliaMailboxContract["dispatch(uint32,bytes32,bytes)"](
    696969,
    recipient,
    params,
    { value: 1 }
  );

  console.log(
    "transaction sent:",
    "https://sepolia.etherscan.io/tx/" + result.hash
  );
  console.log("waiting for the message to get dispatched...");
  // await new Promise((res) => setTimeout(res, 10000));
  // console.log(await sepoliaProvider.getTransaction(result.hash));
  // console.log(await sepoliaProvider.getTransactionReceipt(result.hash));

  let blockHash = undefined;

  while (!blockHash) {
    blockHash = (await sepoliaProvider.getTransactionReceipt(result.hash))
      ?.blockHash;
    console.log("not yet dispatched");
    await new Promise((res) => setTimeout(res, 2000));
  }

  const logs = await sepoliaProvider.getLogs({ blockHash: blockHash });

  let messageId = undefined;
  logs.forEach((log) => {
    if (
      log.transactionHash === result.hash &&
      log.topics[0] ===
        "0x788dbc1b7152732178210e7f4d9d010ef016f9eafbe66786bd7169f56e0c353a"
    ) {
      // console.log(log);
      messageId = log.topics[1];
    }
  });

  if (!messageId) {
    console.log("failed to send transaction, please retry");
    process.exit(1);
  }

  console.log("message id is:", messageId);
  console.log("waiting for galadriel to receive the message...");

  //
  // checking when the message arrived on the other side
  //
  let received = false;
  let galadrielTxHash = undefined;
  let galadrielBlock = undefined;

  while (!received) {
    await new Promise((res) => setTimeout(res, 2000));
    const logs = await galadrielProvider.getLogs({
      fromBlock: actGaladrielBlock,
    });
    console.log("message not received, yet");
    // console.log(logs);
    logs.forEach((log) => {
      if (
        log.topics[0] ===
        "0x1cae38cdd3d3919489272725a5ae62a4f48b2989b0dae843d3c279fee18073a9"
      ) {
        // console.log(log);
        received = true;
        galadrielTxHash = log.transactionHash;
        galadrielBlock = log.blockNumber;
      }
    });
  }

  console.log(
    "message arrived at transaction:",
    "https://explorer.galadriel.com/tx/" + galadrielTxHash
  );

  //
  // checking the data for the new NFT
  //

  await new Promise((res) => setTimeout(res, 2000));

  const logsRequest = await fetch(
    "https://api.tryethernal.com/api/transactions/" +
      galadrielTxHash +
      "/logs?firebaseUserId=aLfnmocM99SAMCh6KkQTp1CVySE3&workspace=Galadriel&page=1&itemsPerPage=20"
  );
  const requestLogs = await logsRequest.json();

  const event = nftContract.interface.parseLog(requestLogs.logs[3]);
  const newNftId = event!.args[1].toString();

  //   console.log(event);
  console.log("id for the new NFT will be: ", newNftId);

  console.log("waiting for the NFT to be minted...");

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

  console.log(
    "sending NFT to origin chain. check etherscan, when it will arrive"
  );
  console.log(
    "https://sepolia.etherscan.io/address/" + process.env.DEPLOYER_PUBLIC_KEY
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
