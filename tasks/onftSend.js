const {getChainId } = require("../utils/helpers")

module.exports = async function (taskArgs, hre) {
    const signers = await ethers.getSigners()
    const owner = signers[0]
    const toAddress = owner.address;
    const tokenId = taskArgs.tokenId

    let localContract, remoteContract;

    if(taskArgs.contract) {
        localContract = taskArgs.contract;
        remoteContract = taskArgs.contract;
    } else {
        localContract = taskArgs.localContract;
        remoteContract = taskArgs.remoteContract;
    }

    if(!localContract || !remoteContract) {
        console.log("Must pass in contract name OR pass in both localContract name and remoteContract name")
        return
    }

    // get remote chain id
    const dstChainId = getChainId(taskArgs.targetNetwork);

    // get local contract
    const localContractInstance = await ethers.getContract(localContract)

    let toAddressBytes32 = ethers.utils.defaultAbiCoder.encode(
        ["address"],
        [toAddress]
      );

    try {
        let tx = await (
            await localContractInstance.sendFrom(
                owner.address,                  // 'from' address to send tokens
                dstChainId,                     // remote  chainId
                tokenId,                        // tokenId to send
                toAddressBytes32,               // to
                { value: ethers.utils.parseEther("0.001") }
            )
        ).wait()
        console.log(`✅ [${hre.network.name}] send ${tokenId} to chain ${taskArgs.targetNetwork}`)
        console.log(` tx: ${tx.transactionHash}`)
    } catch (e) {
        console.log(e)
    }
}
