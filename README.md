# Paranic Omnichain Fungible Token Demo

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

1. Deploy two contracts:  ```goerli``` is the `base` chain. Fuji is the oft for the other chain.

```angular2html
npx hardhat --network goerli scripts/deploy-baseOFT.ts
npx hardhat --network mumbai scripts/deploy-OFT.ts
```

2. Set the "trusted token" (destination OFT token address) so each of them can receive messages from one another, and `only` one another.

```angular2html
npx hardhat run --network goerli scripts/set-trust-token.ts
npx hardhat run --network mumbai scripts/set-trust-token.ts
```

3. Send tokens from goerli to mumbai

```angular2html
npx hardhat run --network goerli scripts/oftsend.ts
```

