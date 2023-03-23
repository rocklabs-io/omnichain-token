import fs from "fs";
import { ethers } from "hardhat";

export const getNonce = async function () {
  const addrs = await ethers.getSigners();
  let addr = addrs[0].address;
  let nonce = await ethers.provider.getTransactionCount(addr);
  console.log("nonce:", nonce);
  return nonce;
};

export const getChainId = function (network: string | number) {
  if (typeof network == "number") {
    return network;
  }
  let config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
  return config.ChainIds[network];
};

export const updateConfig = function (
  network: string,
  contract: string,
  addr: string
) {
  let config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
  if (config.networks[network] == undefined) {
    config.networks[network] = {
      Omnic: "",
      OFT: "",
      ONFT: "",
    };
  }
  config.networks[network][contract] = addr;
  fs.writeFileSync("config.json", JSON.stringify(config, null, "\t"));
  console.log(network, ":", config.networks[network]);
};

export const getContractAddr = function (network: string, contract: string) {
  let config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
  if (config.networks[network] == undefined) {
    return null;
  }
  if (config.networks[network][contract] == undefined) {
    return null;
  }
  let res = config.networks[network][contract];
  if (res == "") {
    return null;
  }
  return res;
};

export const getProxyCanisterAddr = function () {
  let config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
  return config.OmnicCanisterAddr;
};

