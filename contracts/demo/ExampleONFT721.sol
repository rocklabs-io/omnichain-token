// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.9;

import "../ONFT.sol";

contract ExampleONFT721 is ONFT721 {
    uint public nextMintId;
    uint public maxMintId;

    constructor(
        string memory _name,
        string memory _symbol,
        address _omnic,
        uint _startMintId,
        uint _endMintId
    ) ONFT721(_name, _symbol, _omnic) {
        nextMintId = _startMintId;
        maxMintId = _endMintId;
    }

    /// @notice Mint your ONFT
    function mint() external payable {
        require(
            nextMintId <= maxMintId,
            "UniversalONFT721: max mint limit reached"
        );

        uint newId = nextMintId;
        nextMintId++;

        _safeMint(msg.sender, newId);
    }
}
