// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

contract Token {
    address owner;
    uint total_supply = 100000;
    uint current_supply = 0;
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;

    event Transfer(address from, address to, uint amount);
    event Approval(address owner, address spender, uint amount);
    event Mint(address to, uint amount);

    constructor() {
        owner = msg.sender;
    }

    function mint(address to, uint amount) external {
        require(msg.sender == owner, "Error! You are not the token's owner");
        uint mintable_amount = total_supply - current_supply;
        amount = mintable_amount > amount? amount : mintable_amount;
        balances[to] += amount;
        current_supply += amount;

        emit Mint(to, amount);
    }

    function move(address from, address to, uint amount) internal {
        require(balances[from] >= amount);
        require(balances[to] + amount >= balances[to]);
        balances[from] -= amount;
        balances[to] += amount;
    }

    function transfer(address to, uint amount) external returns (bool success) {
        move(msg.sender, to, amount);
        emit Transfer(msg.sender, to, amount);
        return true;

    }

    function transferFrom(address from, address to, uint amount) external returns (bool success) {
        require(allowed[from][msg.sender] >= amount);
        allowed[from][msg.sender] -= amount;
        move(from, to, amount);
        emit Transfer(from, to, amount);
        return true;
    }

    function approve(address spender, uint tokens) external returns (bool success) {
        require(allowed[msg.sender][spender] == 0, "");
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    function balanceOf(address tokenOwner) external view returns (uint balance) {
        return balances[tokenOwner];
    }
}