const CONFIG = require("../constants/config.json")
const ONFT_ARGS = require("../constants/onftArgs.json")
const { ethers } = require("hardhat")
const {updateConfig} = require("../utils/helpers")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`>>> your address: ${deployer}`)

    const endpointAddress = CONFIG["networks"][hre.network.name]["Omnic"]
    const onftArgs = ONFT_ARGS[hre.network.name]
    console.log({ onftArgs })
    console.log(`[${hre.network.name}] Omnic Endpoint address: ${endpointAddress}`)

    let res = await deploy("ExampleONFT721", {
        from: deployer,
        args: ["Omnic NFT test", "ONFT", endpointAddress, onftArgs.startMintId, onftArgs.endMintId],
        log: true,
        waitConfirmations: 1,
    })
    updateConfig(hre.network.name, 'ONFT', res.address);
    
}

module.exports.tags = ["ExampleONFT721"]

