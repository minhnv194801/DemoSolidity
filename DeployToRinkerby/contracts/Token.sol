// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

import "./TokenMinter.sol";

contract Token {
    struct ownership {
        uint time;
        address owner;
    }

    TokenMinter private minter;
    address private ownerId;
    string private nameCid;
    ownership[] private ownerHistory;

    constructor(address owner, string memory newCid) {
        minter = TokenMinter(msg.sender);
        uint currentTime = block.timestamp;
        ownerId = owner;
        nameCid = newCid;
        ownerHistory.push(ownership(currentTime, owner));
    }

    event TransferToken(address from, address to, address token_address);

    function transfer(address to) external {
        require(msg.sender == ownerId, "Only owner can transfer the token");
        ownerId = to;
        uint currentTime = block.timestamp;
        ownerHistory.push(ownership(currentTime, to));
        emit TransferToken(msg.sender, to, address(this));
    }

    function getNameCid() external view returns (string memory) {
        return nameCid;
    }

    function getCurrentOwner() external view returns (address) {
        return ownerId;
    }

    function getOwnerHistory() external view returns (ownership[] memory) {
        return ownerHistory;
    }
}