// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../OFT.sol";

/// @title A OmnichainFungibleToken example of OFT
/// @notice Use this contract only on the BASE CHAIN. It locks tokens on source, on outgoing send(), and unlocks tokens when receiving from other chains.
contract ExampleOFT is OFT {
    constructor(address _omnic) OFT("ExampleOFT", "OFT", _omnic) {}
}
