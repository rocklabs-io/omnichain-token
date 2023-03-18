// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../OFT.sol";

contract BasedOFT is OFT {
    constructor(string memory _name, string memory _symbol, address _omnic) OFT(_name, _symbol, _omnic) {}

    function circulatingSupply() public view virtual override returns (uint) {
        unchecked {
            return totalSupply() - balanceOf(address(this));
        }
    }

    function _debitFrom(address _from, uint32, bytes32, uint _amount) internal virtual override returns(uint) {
        address spender = _msgSender();
        if (_from != spender) _spendAllowance(_from, spender, _amount);
        _transfer(_from, address(this), _amount);
        return _amount;
    }

    function _creditTo(uint32, address _toAddress, uint _amount) internal virtual override returns(uint) {
        _transfer(address(this), _toAddress, _amount);
        return _amount;
    }
}