const MyERC721 = artifacts.require("MyERC721");
const TokenAuction = artifacts.require("TokenAuction");
const name = "Rave Token";
const symbol = "RAVE"

module.exports = function(deployer) {
    deployer.deploy(MyERC721, name, symbol).then(function(){
      return MyERC721.deployed();
    }).then(function(instance){
      return deployer.deploy(TokenAuction, instance.address)
    });
}
