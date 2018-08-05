pragma solidity ^0.4.19;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract MyERC721 is ERC721Token, Ownable {

  constructor (string _name, string _symbol) public ERC721Token(_name, _symbol) {

  }

  struct Rave {
    string venue;
    string artist;
    string date;
  }

  Rave[] raves;

  function balanceOf(address _owner) public view returns (uint256 count) {
        return ownedTokensCount[_owner];
  }

  function tokensOfOwner(address _owner) public view returns(uint256[] ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {

            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalRave = totalSupply();
            uint256 resultIndex = 0;

            uint256 raveId;

            for (raveId = 1; raveId <= totalRave; raveId++) {
                if (tokenOwner[raveId] == _owner) {
                    result[resultIndex] = raveId;
                    resultIndex++;
                }
            }

            return result;
        }
    }

  function mint(string _venue, string _artist, string _date) public {
    Rave memory _rave = Rave({
        venue: _venue,
        artist: _artist,
        date: _date
      });

    uint _raveId = raves.push(_rave) - 1;

    _mint(msg.sender, _raveId);
  }

  function getRave(uint _raveId) public view returns(string venue, string artist, string date) {
    Rave memory _rave = raves[_raveId];

    venue = _rave.venue;
    artist = _rave.artist;
    date = _rave.date;
  }

}
