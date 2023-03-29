# Paranic Omnichain Fungible Token Demo

* Note: This repo refers to [layerzero](https://github.com/LayerZero-Labs/solidity-examples)

 ### Install

```shell
yarn install
```

* The code in the `/contracts` folder demonstrates behaviours.
* There are also example for `OFT`  which illustrate erc20 cross chain functionality, the contract is depended on `Omnic gateway` to send and receive token.
* Always audit your own code and test extensively on `testnet` before going to mainnet 🙏

> The examples below use two chains, however you could substitute any  supported chain! 



# OmnichainFungibleToken (OFT)

The `OmnichainFungibleToken` has two varieties of deployments:

    1. `BasedOFT.sol` - The token supply is minted (on deployment) on the `base` chain. Other chains deploy with 0 supply initially. 
    2. `OFT.sol` - At deploy time, any quantity of tokens can be minted, regardless of chain.    

 For the `BasedOFT`, the initial supply will be minted entirely on the `Base Chain` on deployment. All tokens transferred out of the `base` chain will be locked in the contract (and minted on destination), and tokens transferred out of `other` chains will be burned on that chain. Tokens returning to the `base` chain will be `unlocked` and transferred to the destination address. This results in the `Base chain` being like the home base, hence the name.

In the example deployment below we use `BasedOFT` and the `base` chain is ```goerli```.
Using the Ethereum network ```(testnet: goerli)``` as a `base` (really its like the source of truth) is a security decision.
In the event a chain goes rogue, Ethereum will be the final source of truth for OFT tokens.



## BasedOFT.sol - an omnichain ERC20

> WARNING: **You must perform the setSupportChain() (step 2).**

1. Deploy two contracts:  ```mumbai``` is the `base` chain. Fuji is the oft for the other chain.

```angular2html
npx hardhat --network mumbai deploy --tags ExampleBasedOFT
npx hardhat --network goerli deploy --tags ExampleOFT
```

2. Set the "trusted token" (destination OFT token address) so each of them can receive messages from one another, and `only` one another.

```angular2html
npx hardhat --network goerli setTrustedToken --target-network mumbai --local-contract ExampleOFT --remote-contract ExampleBasedOFT --name OFT
npx hardhat --network mumbai setTrustedToken --target-network goerli --local-contract ExampleBasedOFT --remote-contract ExampleOFT --name OFT
```

3. Send tokens from goerli to mumbai

```angular2html
npx hardhat --network mumbai oftSend --target-network goerli --amount 10 --local-contract ExampleBasedOFT --remote-contract ExampleOFT
```



# OmnichainNonFungibleToken721 (ONFT721)

This ONFT contract allows minting of `nftId`s on separate chains. To ensure two chains can not mint the same `nfId` each contract on each chain is only allowed to mint `nftIds` in certain ranges. Check `constants/onftArgs.json` for the specific test configuration used in this demo.

## ONFT.sol

> WARNING: **You must perform the setTrustedRemote() (step 2).**

1. Deploy two contracts:

```angular2html
 npx hardhat --network goerli deploy --tags ExampleONFT721
 npx hardhat --network mumbai deploy --tags ExampleONFT721
```

2. Set the "trusted token" (destination OFT token address) so each of them can receive messages from one another, and `only` one another.

```angular2html
npx hardhat --network goerli setTrustedToken --target-network mumbai --contract ExampleONFT721 --name ONFT
npx hardhat --network mumbai setTrustedToken --target-network goerli --contract ExampleONFT721 --name ONFT
```

3. Mint an NFT on each chain!

```angular2html
npx hardhat --network goerli onftMint --contract ExampleONFT721
npx hardhat --network mumbai onftMint --contract ExampleONFT721
```

4. Send ONFT across chains

```angular2html
npx hardhat --network goerli onftSend --target-network mumbai --token-id 21 --contract ExampleONFT721
npx hardhat --network mumbai onftSend --target-network goerli --token-id 1 --contract ExampleONFT721 
```

# Testnet contracts

OFT and ONFT contract is deployed in the following address.

* mumbai
    ```angular2html
    OFT base contract address: 0xfff3c4AE718265Bc77d76da00c6E8c5396913c2F
    ONFT contract address: 0x143A5b4bEA8F4f4bf71107D05Fe193b874526c08
    ```
* goerli
    ```angular2html
    OFT contract address: 0x4E07ADB191a616215869d5DF0ed97730c8a20706
    ONFT contract address: 0x3b4BB907807ED37Af8cbCF2eceC875D94e22f3f5
    ```