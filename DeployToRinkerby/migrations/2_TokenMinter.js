const TokenMinter = artifacts.require("TokenMinter");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(TokenMinter, {from: '0xF61b13Cd9b7E6CC7e3609F604232953cA8614BBc'});
};
