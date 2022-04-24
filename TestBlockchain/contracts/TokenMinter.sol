// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

import "./Token.sol";

contract TokenMinter{
    mapping (string => address) private token_map;
    uint private current_supply = 0;
    uint private total_supply = 10;

    event CreateToken(address token_owner, address token_address);

    function mint(address token_owner, string calldata token_name) external returns (address new_token_address) {
        require(current_supply < total_supply, "Error: Maximum token created");
        require(token_map[token_name] == address(0), "Error: Token name not unique");
        
        new_token_address = address(new Token(token_owner, token_name));
        token_map[token_name] = new_token_address;
        current_supply++;

        emit CreateToken(token_owner, new_token_address);
    }

    function get_total_supply() external view returns (uint) {
        return total_supply;
    }

    function get_current_supply() external view returns (uint) {
        return current_supply;
    }
}