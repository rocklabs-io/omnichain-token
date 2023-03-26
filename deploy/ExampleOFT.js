
const CONFIG = require("../constants/config.json")
const { ethers } = require("hardhat")
const {updateConfig} = require("../utils/helpers")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    console.log(`>>> your address: ${deployer}`)

    // get the Endpoint address
    const endpointAddr = CONFIG["networks"][hre.network.name]["Omnic"]
    console.log(`[${hre.network.name}] Omnic Endpoint address: ${endpointAddr}`)

    const res = await deploy("ExampleOFT", {
        from: deployer,
        args: [endpointAddr],
        log: true,
        waitConfirmations: 1,
    })
    updateConfig(hre.network.name, 'OFT', res.address);
}

module.exports.tags = ["ExampleOFT"]
