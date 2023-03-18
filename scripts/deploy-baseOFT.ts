import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { getContractAddr, updateConfig } from "./helpers";
const hre = require("hardhat");

export const deployBaseOFT = async function (chain: string, supply: BigNumber) {
  const Token = await ethers.getContractFactory("ExampleBasedOFT");

  const omnicAddr = getContractAddr(chain, 'Omnic');
  console.log(`${chain} omnic address: ${omnicAddr}` )

  let tokenAddr = getContractAddr(chain, 'OFT');
  let token;
  if (tokenAddr == null) {
    console.log(`deploying base OFT to ${chain}...`);
    token = await Token.deploy(omnicAddr, supply);

    await token.deployed();
    console.log(`OFT deployed to ${chain}, address: ${token.address}` );
    updateConfig(chain, 'OFT', token.address);
  } else {
    console.log("found deployed token:", tokenAddr);
    token = await ethers.getContractAt("ExampleBasedOFT", tokenAddr);
  }
  return token;
};

const main = async function () {
  let chain = hre.network.name;
  let supply = ethers.utils.parseUnits('1000000', 18);
  await deployBaseOFT(chain, supply);

};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
