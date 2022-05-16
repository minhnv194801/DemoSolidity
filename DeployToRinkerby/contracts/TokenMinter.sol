// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

import "./Token.sol";

contract TokenMinter{
    struct mintResult {
        uint time;
        address tokenAddress;
    }
    mapping (string => address) private tokenMap;
    mapping (address => address[]) private ownership;
    mintResult[] private mintHistory;
    uint private currentSupply = 0;
    uint private totalSupply = 10000;

    event CreateToken(address tokenOwner, address tokenAddress);

    function mint(address tokenOwner, string calldata tokenCid) external returns (address newTokenAddress) {
        require(currentSupply < totalSupply, "Error: Maximum token created");
        require(tokenMap[tokenCid] == address(0), "Error: Token name not unique");
        
        newTokenAddress = address(new Token(tokenOwner, tokenCid));
        tokenMap[tokenCid] = newTokenAddress;
        ownership[msg.sender].push(newTokenAddress);
        mintHistory.push(mintResult(block.timestamp, newTokenAddress));
        currentSupply++;

        emit CreateToken(tokenOwner, newTokenAddress);
    }

    function getTotalSupply() external view returns (uint) {
        return totalSupply;
    }

    function getCurrentSupply() external view returns (uint) {
        return currentSupply;
    }

    function getOwnTokenAdress() external view returns (address[] memory) {
        return ownership[msg.sender];
    }

    function getMintHistory() external view returns (mintResult[] memory) {
        return mintHistory;
    }
}