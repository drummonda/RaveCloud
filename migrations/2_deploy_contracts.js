const MyERC721 = artifacts.require("MyERC721");
const TokenAuction = artifacts.require("TokenAuction");
const name = "Rave Token";
const symbol = "RAVE"

module.exports = async function(deployer) {
  await deployer.deploy(MyERC721, name, symbol);
  const instance = await MyERC721.deployed();
  await deployer.deploy(TokenAuction, instance.address);
};
