// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/**
 * @dev Interface of the OFT standard
 */
interface IONFT721 is IERC721, IERC165 {
    // send token `_tokenId` to (`_dstChainId`, `_to`) from `_from`
    function sendFrom(address _from, uint32 _dstChainId, uint256 _tokenId, bytes32 _to) external payable;
    //send tokens `_tokenIds[]` to (`_dstChainId`, `_to`) from `_from`
    function sendBatchFrom(address _from, uint32 _dstChainId, uint256[] calldata _tokenIds, bytes32 _to) external payable;

}
