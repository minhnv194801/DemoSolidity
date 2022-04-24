// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

import "./TokenMinter.sol";

contract Token {
    TokenMinter private minter;
    address private owner_id;
    string private name;

    constructor(address owner, string memory newname) {
        minter = TokenMinter(msg.sender);
        owner_id = owner;
        name = newname;
    }

    event TransferToken(address from, address to, address token_address);

    function transfer(address to) external {
        require(msg.sender == owner_id, "Only owner can transfer the token");
        owner_id = to;
        emit TransferToken(msg.sender, to, address(this));
    }

    function get_name() external view returns (string memory) {
        return name;
    }

    function get_current_owner() external view returns (address) {
        return owner_id;
    }
}