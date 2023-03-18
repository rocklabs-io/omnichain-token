// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../extension/BaseOFT.sol";

/// @title A OmnichainFungibleToken example of BasedOFT
/// @notice Use this contract only on the BASE CHAIN. It locks tokens on source, on outgoing send(), and unlocks tokens when receiving from other chains.
contract ExampleBasedOFT is BasedOFT {
    constructor(address _omnic, uint _initialSupply) BasedOFT("BasedOFT", "OFT", _omnic) {
        _mint(_msgSender(), _initialSupply);
    }
}
