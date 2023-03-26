const fs = require("fs")

getNonce = async () => {
  const addrs = await ethers.getSigners();
  let addr = addrs[0].address;
  let nonce = await ethers.provider.getTransactionCount(addr);
  console.log("nonce:", nonce);
  return nonce;
};

getChainId = (network) => {
  if (typeof network == "number") {
    return network;
  }
  let config = JSON.parse(fs.readFileSync("./constants/config.json", "utf-8"));
  return config.ChainIds[network];
};

updateConfig = (
  network,
  contract,
  addr
) => {
  let config = JSON.parse(fs.readFileSync("./constants/config.json", "utf-8"));
  if (config.networks[network] == undefined) {
    config.networks[network] = {
      Omnic: "",
      OFT: "",
      ONFT: "",
    };
  }
  config.networks[network][contract] = addr;
  fs.writeFileSync("./constants/config.json", JSON.stringify(config, null, "\t"));
  console.log(network, ":", config.networks[network]);
};

getContractAddr = (network, contract) => {
  let config = JSON.parse(fs.readFileSync("./constants/config.json", "utf-8"));
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

getProxyCanisterAddr = () => {
  let config = JSON.parse(fs.readFileSync("./constants/config.json", "utf-8"));
  return config.OmnicCanisterAddr;
};

module.exports = {
  getNonce,
  getChainId,
  updateConfig,
  getContractAddr,
  getProxyCanisterAddr
}

