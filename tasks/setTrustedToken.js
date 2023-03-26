const {getContractAddr, getChainId } = require("../utils/helpers")

module.exports = async function (taskArgs, hre) {
    let localContract, remoteContract;

    if(taskArgs.contract) {
        localContract = taskArgs.contract;
        remoteContract = taskArgs.contract;
    } else {
        localContract = taskArgs.localContract;
        remoteContract = taskArgs.remoteContract;
    }

    const contractName = taskArgs.name;

    if(!localContract || !remoteContract) {
        console.log("Must pass in contract name OR pass in both localContract name and remoteContract name")
        return
    }

    // get local contract
    const localContractInstance = await ethers.getContract(localContract)

    // get deployed remote contract address
    const remoteAddress = getContractAddr(taskArgs.targetNetwork, contractName)

    // get remote chain id
    const remoteChainId = getChainId(taskArgs.targetNetwork)

    // convert to bytes32
    let addressToBytes32 = ethers.utils.defaultAbiCoder.encode(
        ["address"],
        [remoteAddress]
      );

    console.log(`${taskArgs.targetNetwork} ${contractName} address to bytes32 ${addressToBytes32}`);

    // set
    try {
        let tx = await (await localContractInstance.setSupportChain(remoteChainId, addressToBytes32)).wait()
        console.log(`✅ [${hre.network.name}] setSupportChain(${remoteChainId}, ${addressToBytes32})`)
        console.log(` tx: ${tx.transactionHash}`)
    } catch (e) {
        if (e.error.message.includes("The chainId + address is already trusted")) {
            console.log("*source already set*")
        } else {
            console.log(`❌ [${hre.network.name}] setSupportChain(${remoteChainId}, ${addressToBytes32})`)
        }
    }

}
