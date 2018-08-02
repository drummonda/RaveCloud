pragma solidity ^0.4.19;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract MyERC721 is ERC721Token {
  constructor (string _name, string _symbol) public ERC721Token(_name, _symbol) {

  }
}
