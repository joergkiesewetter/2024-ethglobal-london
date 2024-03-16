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

  const sepoliaMailboxAddress = process.env.SEPOLIA_MAILBOX_ADDRESS!;
  const sepoliaMailboxContract = new ethers.Contract(
    sepoliaMailboxAddress,
    mailboxAbi,
    sepoliaWallet
  );

  const abi = AbiCoder.defaultAbiCoder();
  const params = abi.encode(
    ["address", "string"], // encode as address array
    [process.env.DEPLOYER_PUBLIC_KEY!, " with a golden Background"]
  );

  // 0xb2cb8f619ad5b1ea98633ae88524c0a6480775c8;
  const recipient =
    "0x000000000000000000000000" +
    process.env.APEFUL_DEPLOYMENT_ADDRESS!.slice(2);
  console.log(recipient);
  const result = await sepoliaMailboxContract["dispatch(uint32,bytes32,bytes)"](
    696969,
    recipient,
    params,
    { value: 1 }
  );

  // const txHash = result.hash;
  // console.log("txHash", txHash);
  console.log(result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
