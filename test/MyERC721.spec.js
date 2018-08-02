const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const { expect, assert } = chai;

const MyERC721 = artifacts.require("MyERC721");

contract("Testing ERC721 contract", accounts => {
  let token;
  const name = "BlueCat";
  const symbol = "BCAT";

  const account1 = accounts[1];
  const tokenId1 = 1111;
  const tokenUri1 = "hehehe";

  const account2 = accounts[2];
  const tokenId2 = 2222;
  const tokenUri2 = "hahaha";

  const account3 = accounts[3];

  it('should be able to deploy and mint ERC721 token', async () => {
    token = await MyERC721.new(name, symbol);
    expect(await token.symbol()).to.equal(symbol);
    expect(await token.name()).to.equal(name);
  });

  it('should be unique', async () => {
    token1 = await MyERC721.new(name, symbol);
    token2 = await MyERC721.new(name, symbol);
    const additionalToken = await token._mint(account2, tokenId2);
    expect(Number(await token.totalSupply())).to.equal(2);

    expect(await token.exists(tokenId1)).to.be.true;
    expect(await token.exists(tokenId2)).to.be.true;
    expect(await token.exists(999)).to.be.false;

    expect(await token.ownerOf(tokenId1)).to.equal(account1);
    expect(await token.ownerOf(tokenId2)).to.equal(account2);
  });

  it('should allow safe transfers', async () => {
    const unownedTokenId = token.safeTransferFrom(account2, account3, tokenId1, {from: accounts[2]});
    expect(unownedTokenId).to.be.rejectedWith('VM Exception while processing transaction: revert');

    const wrongOwner = token.safeTransferFrom(account1, account3, tokenId2, {from: accounts[1]})
    expect(wrongOwner).to.be.rejectedWith('VM Exception while processing transaction: revert');

    const wrongFromGas = token.safeTransferFrom(account2, account3, tokenId2, {from: accounts[1]});
    expect(wrongFromGas).to.be.rejectedWith('VM Exception while processing transaction: revert');

    await token.safeTransferFrom(account2, account3, tokenId2, {from: accounts[2]});
    expect(await token.ownerOf(tokenId2)).to.equal(account3);
  })
})
