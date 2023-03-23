import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { getContractAddr, updateConfig } from "./helpers";
const hre = require("hardhat");

export const deployONFT721 = async function (
  chain: string,
  name: string,
  symbol: string,
  start_id: number,
  end_id: number
  ) {
  const Token = await ethers.getContractFactory("ExampleONFT721");

  const omnicAddr = getContractAddr(chain, 'Omnic');
  console.log(`${chain} omnic address: ${omnicAddr}` )

  let tokenAddr = getContractAddr(chain, 'ONFT');
  let token;
  if (tokenAddr == null) {
    console.log(`deploying ONFT to ${chain}...`);
    token = await Token.deploy(name, symbol, omnicAddr, start_id, end_id);

    await token.deployed();
    console.log(`ONFT deployed to ${chain}, address: ${token.address}` );
    updateConfig(chain, 'ONFT', token.address);
  } else {
    console.log("found deployed token:", tokenAddr);
    token = await ethers.getContractAt("ExampleONFT721", tokenAddr);
  }
  return token;
};

const main = async function () {
  let chain = hre.network.name;
  let name = "ExampleONFT721";
  let symbol = "ONFT";

  // note: different chain has to set different range
  let start_id: number;
  let end_id: number;
  if (chain == "goerli"){
    start_id = 0;
    end_id = 10000;
  } else if (chain == "mumbai") {
    start_id = 10001;
    end_id = 20000;
  } else {
    start_id = 20001;
    end_id = 1000000;
  }

  await deployONFT721(chain, name, symbol, start_id, end_id);

};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
