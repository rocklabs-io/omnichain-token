// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @dev Interface of the OFT standard
 */
interface IOFT is IERC20 {
    function sendFrom(address _from, uint32 _dstChainId, uint256 _amount, bytes32 _to) external payable;

    /**
     * @dev returns the circulating amount of tokens on current chain
     */
    function circulatingSupply() external view returns (uint);

    /**
     * @dev returns the address of the ERC20 token
     */
    function token() external view returns (address);

}
