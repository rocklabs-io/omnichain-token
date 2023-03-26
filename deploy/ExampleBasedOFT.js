const CONFIG = require("../constants/config.json")
const { ethers } = require("hardhat")
const {updateConfig} = require("../utils/helpers")


module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    console.log(`>>> your address: ${deployer}`)

    if (hre.network.name !== CONFIG.BaseChain) {
        console.log("*** Warning: Use [goerli] as the base chain for this example!")
        return
    }

    // get the Endpoint address
    const endpointAddr = CONFIG["networks"][hre.network.name]["Omnic"]
    const globalSupply = ethers.utils.parseUnits(CONFIG.GlobalSupply, 18)
    console.log(`[${hre.network.name}] Omnic Endpoint address: ${endpointAddr}`)

    const res = await deploy("ExampleBasedOFT", {
        from: deployer,
        args: [endpointAddr, globalSupply],
        log: true,
        waitConfirmations: 1,
    })
    updateConfig(hre.network.name, 'OFT', res.address);
}

module.exports.tags = ["ExampleBasedOFT"]
