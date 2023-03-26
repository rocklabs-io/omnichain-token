const {getChainId } = require("../utils/helpers")

module.exports = async function (taskArgs, hre) {
    let signers = await ethers.getSigners()
    let owner = signers[0]
    let toAddress = owner.address;
    let amount = ethers.utils.parseEther(taskArgs.amount)

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
    const remoteChainId = getChainId(taskArgs.targetNetwork)

    // get local contract
    const localContractInstance = await ethers.getContract(localContract)

    let toAddressBytes32 = ethers.utils.defaultAbiCoder.encode(
        ["address"],
        [toAddress]
    );

    console.log("dst chain id:", remoteChainId)

    try {
        let tx = await (
            await localContractInstance.sendFrom(
                owner.address,                    // 'from' address to send tokens
                remoteChainId,                    // remote  chainId
                amount,                           // amount of tokens to send (in wei)
                toAddressBytes32,                 // to
                { value: ethers.utils.parseEther("0.001") }
            )
        ).wait()
        console.log(
            `✅ Message Sent [${hre.network.name}] send OFT to [${taskArgs.targetNetwork}], user address:[${toAddress}]`
          );
        console.log(` tx: ${tx.transactionHash}`);
    } catch(e) {
        console.log('error sending transaction, ', e)
    }

}
