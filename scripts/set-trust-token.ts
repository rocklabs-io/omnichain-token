import { ethers } from "hardhat";
import { getContractAddr, getChainId } from "./helpers";
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
  let otherChainOFT = getContractAddr(otherChain, "OFT");
  if (otherChainOFT == null) {
    throw new Error("OFT is not available, please deploy it first.");
  }
  let oftBytes32 = ethers.utils.defaultAbiCoder.encode(
    ["address"],
    [otherChainOFT]
  );
  console.log(otherChain, "oft token to bytes32:", oftBytes32);

  await token.setSupportChain(getChainId(otherChain), oftBytes32);
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
