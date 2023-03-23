// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import "./interfaces/IOmnic.sol";
import "./interfaces/IONFT.sol";

import {TypeCasts} from "./utils/TypeCasts.sol";


contract ONFT721 is IONFT721, ERC721, ERC165{
    // omnic gateway
    uint32 public chainId;
    IOmnic omnic;

    // chain id => token address
    mapping(uint32 => bytes32) tokenAddrs;


    // events 
    event SendToChain(uint32 indexed _dstChainId, address indexed _from, bytes32 indexed _to, uint256[] _tokenIds);
    event ReceiveFromChain(uint32 indexed _srcChainId, bytes32 indexed _srcSenderAddress, address indexed _to, uint256[] _tokenIds);

    /********************* modifier ****************************/

    modifier onlyOmnicGateway() {
        require(
            msg.sender == address(omnic),
            "Omnic: caller must be omnic gateway address"
        );
        _;
    }

    // constructor
    constructor(string memory _name, string memory _symbol, address _omnic) ERC721(_name, _symbol) {
        omnic = IOmnic(_omnic);
        chainId = uint32(block.chainid);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC165) returns (bool) {
        return interfaceId == type(IONFT721).interfaceId || super.supportsInterface(interfaceId);
    }

    function _debitFrom(address _from, uint32, bytes32, uint _tokenId) internal virtual {
        require(_isApprovedOrOwner(_msgSender(), _tokenId), "ONFT721: send caller is not owner nor approved");
        require(ERC721.ownerOf(_tokenId) == _from, "ONFT721: send from incorrect owner");
        _transfer(_from, address(this), _tokenId);
    }

    function _creditTo(uint16, address _toAddress, uint _tokenId) internal virtual {
        require(!_exists(_tokenId) || (_exists(_tokenId) && ERC721.ownerOf(_tokenId) == address(this)));
        if (!_exists(_tokenId)) {
            _safeMint(_toAddress, _tokenId);
        } else {
            _transfer(address(this), _toAddress, _tokenId);
        }
    }

    function sendFrom(address _from, uint32 _dstChainId, uint256 _tokenId, bytes32 _to) public payable {
        _send(_from, _dstChainId,  _toSingletonArray(_tokenId), _to);
    }

    function sendBatchFrom(address _from, uint32 _dstChainId, uint256[] memory _tokenId, bytes32 _to) public payable {
        _send(_from, _dstChainId, _tokenId, _to);
    }

    // omnic gateway call this interface
    function handleMessage(
        uint32 _srcChainId,
        bytes32 _srcSenderAddress,
        uint32 _nonce,
        bytes calldata payload
    ) public onlyOmnicGateway {
        _handle_transfer(_srcChainId, _srcSenderAddress, _nonce, payload);
    }

    /******************************  owner call  ***************************************/

    function setSupportChainByBytes(uint32 chain, bytes32 addr) public onlyOwner(){
        tokenAddrs[chain] = addr;
    }

    // support evm chains
    function setSupportChainByAddress(uint32 chain, address addr) public onlyOwner(){
        tokenAddrs[chain] = TypeCasts.addressToBytes32(addr);
    }

    /******************************  internal function  ***************************************/

    function _debitFrom(address _from, uint32, bytes32, uint _tokenId) internal virtual {
        require(_isApprovedOrOwner(_msgSender(), _tokenId), "ONFT721: send caller is not owner nor approved");
        require(ERC721.ownerOf(_tokenId) == _from, "ONFT721: send from incorrect owner");
        _transfer(_from, address(this), _tokenId);
    }

    function _creditTo(uint32, address _toAddress, uint _tokenId) internal virtual {
        require(!_exists(_tokenId) || (_exists(_tokenId) && ERC721.ownerOf(_tokenId) == address(this)));
        if (!_exists(_tokenId)) {
            _safeMint(_toAddress, _tokenId);
        } else {
            _transfer(address(this), _toAddress, _tokenId);
        }
    }

    function _toSingletonArray(uint element) internal pure returns (uint[] memory) {
        uint[] memory array = new uint[](1);
        array[0] = element;
        return array;
    }


    function _send(address _from, uint32 _dstChainId, uint256[] memory _tokenIds, bytes32 _to) internal virtual {
        require(_tokenIds.length > 0, "Paranic: tokenIds[] is empty");
        require(_tokenIds.length == 1 || _tokenIds.length <= dstChainIdToBatchLimit[_dstChainId], "ONFT721: batch size exceeds dst batch limit");
        require(tokenAddrs[_dstChainId] != bytes32(0x0), "destination chain not support.");

        for (uint i = 0; i < _tokenIds.length; i++) {
            _debitFrom(_from, _dstChainId, _to, _tokenIds[i]);
        }

        bytes memory payload = abi.encode(
            chainId,
            _dstChainId,
            TypeCasts.addressToBytes32(address(this)),
            _tokenIds,
            _to
        );

        // @todo: how to charge gas fee?
        omnic.sendMessage{value: msg.value}(
            _dstChainId,
            tokenAddrs[_dstChainId],
            payload,
            payable(tx.origin),
            address(0x0) // pay in native token
        );

        emit SendToChain(_dstChainId, _from, _to, amount);
    }

    function _handle_transfer(uint32, bytes32, uint64, bytes memory _payload) internal {
        (uint32 srcChain, uint32 dstChain, bytes32 srcTokenAddr, uint256[] memory tokenIds, bytes32 to) = abi.decode(_payload, (uint32, uint32, bytes32, uint256[], bytes32));
        require(dstChain == chainId, "dst chain is not this chain");
        require(srcTokenAddr == tokenAddrs[srcChain], "wrong token address");

        address toAddr = TypeCasts.bytes32ToAddress(to);

        for (uint i = 0; i < tokenIds.length; i++) {
            _creditTo(srcChain, toAddr, tokenIds[i]);
        }

        emit ReceiveFromChain(srcChain, srcTokenAddr, toAddr, tokenIds);
    }

}