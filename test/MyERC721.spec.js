const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { assertRevert } = require('openzeppelin-solidity/test/helpers/assertRevert');
chai.use(chaiAsPromised);
const { expect, assert } = chai;

const MyERC721 = artifacts.require("MyERC721");


contract("Testing ERC721 contract", async accounts => {

  const name = "Rave Token";
  const symbol = "RAVE";

  const venue = "The Fillmore";
  const artist = "RAC";
  const date = "09/20/18";

  const account1 = accounts[1];

  describe("token", () => {
    it("has a name and a symbol", async () => {
      const instance = await MyERC721.new(name, symbol);
      let gotName = await instance.name();
      let gotSymbol = await instance.symbol();

      expect(gotName).to.equal("Rave Token");
      expect(gotSymbol).to.equal("RAVE");
    })
  })

  describe("mint", () => {
    it("can mint tokens successfully", async () => {
      const instance = await MyERC721.new(name, symbol);
      let owner = await instance.owner();

      await instance.mint(venue, artist, date);

      let token = await instance.tokenOfOwnerByIndex(owner, 0);
      let raves = await instance.getRave(token);
      assert.deepEqual(raves, [venue, artist, date]);
    })
  })

  describe("tokensOfOwner", () => {
    it("Can get all the tokens of an owner", async () => {
      const instance = await MyERC721.new(name, symbol);
      let owner = await instance.owner();

      const newToken = await instance.mint(venue, artist, date);
      const ownerTokens = await instance.tokensOfOwner(owner);
      expect(ownerTokens.length).to.equal(1);
    })
  })



  // describe('like a full ERC721', function () {
  //   beforeEach(async function () {
  //     await this.token._mint(creator, firstTokenId, { from: creator });
  //     await this.token._mint(creator, secondTokenId, { from: creator });
  //   });

  //   describe('mint', function () {
  //     const to = accounts[1];
  //     const tokenId = 3;

  //     beforeEach(async function () {
  //       await this.token._mint(to, tokenId);
  //     });

  //     it('adjusts owner tokens by index', async function () {
  //       const token = await this.token.tokenOfOwnerByIndex(to, 0);
  //       expect(token.toNumber()).to.equal(tokenId);
  //     });

  //     it('adjusts all tokens list', async function () {
  //       const newToken = await this.token.tokenByIndex(2);
  //       expect(newToken.toNumber()).to.equal(tokenId);
  //     });
  //   });

  //   describe('burn', function () {
  //     const tokenId = firstTokenId;
  //     const sender = creator;

  //     beforeEach(async function () {
  //       await this.token._burn(sender, tokenId, { from: sender });
  //     });

  //     it('removes that token from the token list of the owner', async function () {
  //       const token = await this.token.tokenOfOwnerByIndex(sender, 0);
  //       expect(token.toNumber()).to.equal(secondTokenId);
  //     });

  //     it('adjusts all tokens list', async function () {
  //       const token = await this.token.tokenByIndex(0);
  //       expect(token.toNumber()).to.equal(secondTokenId);
  //     });

  //     it('burns all tokens', async function () {
  //       await this.token._burn(sender, secondTokenId, { from: sender });
  //       const total = await this.token.totalSupply();
  //       expect(total.toNumber()).to.equal(0);
  //       await assertRevert(this.token.tokenByIndex(0));
  //     });
  //   });

  //   describe('removeTokenFrom', function () {
  //     beforeEach(async function () {
  //       await this.token.removeTokenFrom(creator, firstTokenId, { from: creator });
  //     });

  //     it('has been removed', async function () {
  //       await assertRevert(this.token.tokenOfOwnerByIndex(creator, 1));
  //     });

  //     it('adjusts token list', async function () {
  //       const token = await this.token.tokenOfOwnerByIndex(creator, 0);
  //       expect(token.toNumber()).to.equal(secondTokenId);
  //     });

  //     it('adjusts owner count', async function () {
  //       const count = await this.token.balanceOf(creator);
  //       expect(count.toNumber()).to.equal(1);
  //     });

  //     it('does not adjust supply', async function () {
  //       const total = await this.token.totalSupply();
  //       expect(total.toNumber()).to.equal(2);
  //     });
  //   });

  //   describe('metadata', function () {
  //     const sampleUri = 'mock://mytoken';

  //     it('has a name', async function () {
  //       const tokenName = await this.token.name();
  //       expect(tokenName).to.equal(name);
  //     });

  //     it('has a symbol', async function () {
  //       const tokenSymbol = await this.token.symbol();
  //       expect(tokenSymbol).to.equal(symbol);
  //     });

  //     it('sets and returns metadata for a token id', async function () {
  //       await this.token._setTokenURI(firstTokenId, sampleUri);
  //       const uri = await this.token.tokenURI(firstTokenId);
  //       expect(uri).to.equal(sampleUri);
  //     });

  //     it('can burn token with metadata', async function () {
  //       await this.token._setTokenURI(firstTokenId, sampleUri);
  //       await this.token._burn(creator, firstTokenId, {from: creator});
  //       const exists = await this.token.exists(firstTokenId);
  //       expect(exists).to.equal(false);
  //     });

  //     it('returns empty metadata for token', async function () {
  //       const uri = await this.token.tokenURI(firstTokenId);
  //       expect(uri).to.equal('');
  //     });

  //     it('reverts when querying metadata for non existant token id', async function () {
  //       await assertRevert(this.token.tokenURI(500));
  //     });
  //   });

  //   describe('totalSupply', function () {
  //     it('returns total token supply', async function () {
  //       const totalSupply = await this.token.totalSupply();
  //       expect(totalSupply.toNumber()).to.equal(2);
  //     });
  //   });

  //   describe('tokenOfOwnerByIndex', function () {
  //     const owner = creator;
  //     const another = accounts[1];

  //     describe('when the given index is lower than the amount of tokens owned by the given address', function () {
  //       it('returns the token ID placed at the given index', async function () {
  //         const tokenId = await this.token.tokenOfOwnerByIndex(owner, 0);
  //         expect(tokenId.toNumber()).to.equal(firstTokenId);
  //       });
  //     });

  //     describe('when the index is greater than or equal to the total tokens owned by the given address', function () {
  //       it('reverts', async function () {
  //         await assertRevert(this.token.tokenOfOwnerByIndex(owner, 2));
  //       });
  //     });

  //     describe('when the given address does not own any token', function () {
  //       it('reverts', async function () {
  //         await assertRevert(this.token.tokenOfOwnerByIndex(another, 0));
  //       });
  //     });

  //     describe('after transferring all tokens to another user', function () {
  //       beforeEach(async function () {
  //         await this.token.transferFrom(owner, another, firstTokenId, { from: owner });
  //         await this.token.transferFrom(owner, another, secondTokenId, { from: owner });
  //       });

  //       it('returns correct token IDs for target', async function () {
  //         const count = await this.token.balanceOf(another);
  //         expect(count.toNumber()).to.equal(2);
  //         const tokensListed = await Promise.all(_.range(2).map(i => this.token.tokenOfOwnerByIndex(another, i)));
  //       });

  //       it('returns empty collection for original owner', async function () {
  //         const count = await this.token.balanceOf(owner);
  //         expect(count.toNumber()).to.equal(0);
  //         await assertRevert(this.token.tokenOfOwnerByIndex(owner, 0));
  //       });
  //     });
  //   });

  //   describe('tokenByIndex', function () {
  //     it('should return all tokens', async function () {
  //       const tokensListed = await Promise.all(_.range(2).map(i => this.token.tokenByIndex(i)));
  //       // tokensListed.map(t => t.toNumber()).should.have.members([firstTokenId, secondTokenId]);
  //     });

  //     it('should revert if index is greater than supply', async function () {
  //       await assertRevert(this.token.tokenByIndex(2));
  //     });

  //     [firstTokenId, secondTokenId].forEach(function (tokenId) {
  //       it(`should return all tokens after burning token ${tokenId} and minting new tokens`, async function () {
  //         const owner = accounts[0];
  //         const newTokenId = 300;
  //         const anotherNewTokenId = 400;

  //         await this.token._burn(owner, tokenId, { from: owner });
  //         await this.token._mint(owner, newTokenId, { from: owner });
  //         await this.token._mint(owner, anotherNewTokenId, { from: owner });

  //         const count = await this.token.totalSupply();
  //         expect(count.toNumber()).to.equal(3);

  //         const tokensListed = await Promise.all(_.range(3).map(i => this.token.tokenByIndex(i)));
  //         const expectedTokens = _.filter(
  //           [firstTokenId, secondTokenId, newTokenId, anotherNewTokenId],
  //           x => (x !== tokenId)
  //         );
  //         // tokensListed.map(t => t.toNumber()).should.have.members(expectedTokens);
  //       });
  //     });
  //   });
  // });
})
