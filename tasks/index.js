//
task("setTrustedToken","setTrustedToken enable dst chain token address", require("./setTrustedToken"))
    .addParam("targetNetwork", "the target network to set as a trusted remote")
    .addParam("name", "choose oft or onft")
    .addOptionalParam("localContract", "Name of local contract if the names are different")
    .addOptionalParam("remoteContract", "Name of remote contract if the names are different")
    .addOptionalParam("contract", "If both contracts are the same name")

//
task("oftSend", "send tokens to another chain", require("./oftSend"))
    .addParam("amount", "qty of tokens to send")
    .addParam("targetNetwork", "the target network to let this instance receive messages from")
    .addOptionalParam("localContract", "Name of local contract if the names are different")
    .addOptionalParam("remoteContract", "Name of remote contract if the names are different")
    .addOptionalParam("contract", "If both contracts are the same name")

//
task("onftMint", "mint() mint ONFT", require("./onftMint"))
    .addParam("contract", "Name of contract")

task("getSigners", "show the signers of the current mnemonic", require("./getSigners")).addOptionalParam("n", "how many to show", 3, types.int)

// //
task("onftSend", "send an ONFT nftId from one chain to another", require("./onftSend"))
    .addParam("tokenId", "the tokenId of ONFT")
    .addParam("targetNetwork", "the chainId to transfer to")
    .addOptionalParam("localContract", "Name of local contract if the names are different")
    .addOptionalParam("remoteContract", "Name of remote contract if the names are different")
    .addOptionalParam("contract", "If both contracts are the same name")