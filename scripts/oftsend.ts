import { ethers } from "hardhat";
import { getContractAddr, updateConfig, getChainId } from "./helpers";
const hre = require("hardhat");

export const setTrustToken = async function (
  chain: string,
  isBasechain: boolean,
  otherChain: string
) {
  let tokenAddr = getContractAddr(chain, "OFT");

  let token;
  if (tokenAddr == null) {
    throw new Error("OFT is not available, please deploy it first.");
  } else {
    console.log("found deployed token:", tokenAddr);
    if (isBasechain) {
      token = await ethers.getContractAt("ExampleBasedOFT", tokenAddr);
    } else {
      token = await ethers.getContractAt("ExampleOFT", tokenAddr);
    }
  }

  // send token
  let signers = await ethers.getSigners();
  let owner = signers[0];
  let toAddress = owner.address;
  let qty = ethers.utils.parseEther("10");

  let dstChain = getChainId(otherChain);

  let toAddressBytes32 = ethers.utils.defaultAbiCoder.encode(
    ["address"],
    [toAddress]
  );

  let tx = await (
    await token.sendFrom(
      owner.address, // 'from' address to send tokens
      dstChain, // dst chain id
      qty, // amount of tokens to send (in wei)
      toAddressBytes32, // 'to' address to send tokens
      { value: ethers.utils.parseEther("0.001") }
    )
  ).wait();
  console.log(
    `✅ Message Sent [${hre.network.name}] send OFT to [${otherChain}], user address:[${toAddress}]`
  );
  console.log(` tx: ${tx.transactionHash}`);
};

const main = async function () {
  let baseChain = "goerli";
  let chain = hre.network.name;
  let otherChain = chain == baseChain ? "mumbai" : baseChain;

  await setTrustToken(chain, baseChain == chain, otherChain);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
