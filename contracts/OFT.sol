// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import "./interfaces/IOmnic.sol";
import "./interfaces/IOFT.sol";

import {TypeCasts} from "./utils/TypeCasts.sol";


contract OFT is IOFT, ERC165, ERC20, Ownable{
    // omnic gateway
    uint32 public chainId;
    IOmnic omnic;

    // chain id => token address
    mapping(uint32 => bytes32) tokenAddrs;


    // events 
    event SendToChain(uint32 indexed _dstChainId, address indexed _from, bytes32 indexed _to, uint _amount);
    event ReceiveFromChain(uint32 indexed _srcChainId, address indexed _to, uint _amount);

    /********************* modifier ****************************/

    modifier onlyOmnicGateway() {
        require(
            msg.sender == address(omnic),
            "Omnic: caller must be omnic gateway address"
        );
        _;
    }

    // constructor
    constructor(string memory _name, string memory _symbol, address _omnic) ERC20(_name, _symbol) {
        omnic = IOmnic(_omnic);
        chainId = uint32(block.chainid);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IOFT).interfaceId || interfaceId == type(IERC20).interfaceId || super.supportsInterface(interfaceId);
    }

    function token() public view virtual returns (address) {
        return address(this);
    }

    function circulatingSupply() public view virtual returns (uint) {
        return totalSupply();
    }
        

    function sendFrom(address _from, uint32 _dstChainId, uint256 _amount, bytes32 _to) public payable {
        _send(_from, _dstChainId, _amount, _to);
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

    function setSupportChain(uint32 chain, bytes32 addr) public onlyOwner(){
        tokenAddrs[chain] = addr;
    }

    /******************************  internal function  ***************************************/

    function _debitFrom(address _from, uint32, bytes32, uint _amount) internal virtual returns(uint) {
        address spender = _msgSender();
        if (_from != spender) _spendAllowance(_from, spender, _amount);
        _burn(_from, _amount);
        return _amount;
    }

    function _creditTo(uint32, address _toAddress, uint _amount) internal virtual returns(uint) {
        _mint(_toAddress, _amount);
        return _amount;
    }


    function _send(address _from, uint32 _dstChainId, uint256 _amount, bytes32 _to) internal {
        require(tokenAddrs[_dstChainId] != bytes32(0x0), "destination chain not support.");

        uint amount = _debitFrom(_from, _dstChainId, _to, _amount);

        bytes memory payload = abi.encode(
            chainId,
            _dstChainId,
            TypeCasts.addressToBytes32(address(this)),
            amount,
            _to
        );

        omnic.sendMessage{value: msg.value}(
            _dstChainId,
            tokenAddrs[_dstChainId],
            payload,
            payable(tx.origin),
            address(0x0) // pay in native token
        );

        emit SendToChain(_dstChainId, _from, _to, amount);
    }

    function _handle_transfer(uint32 _srcChainId, bytes32, uint64, bytes memory _payload) internal {
        (, uint32 localChain, bytes32 tokenAddr, uint amount, bytes32 to) = abi.decode(_payload, (uint32, uint32, bytes32, uint, bytes32));
        require(localChain == chainId, "dst chain is not this chain");
        require(tokenAddr == tokenAddrs[srcChain]), "wrong token address");

        address toAddr = TypeCasts.bytes32ToAddress(to);

        amount = _creditTo(_srcChainId, toAddr, amount);
        emit ReceiveFromChain(_srcChainId, toAddr, amount);
    }

}