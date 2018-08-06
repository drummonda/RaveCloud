const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { assertRevert } = require('openzeppelin-solidity/test/helpers/assertRevert');
chai.use(chaiAsPromised);
const { expect, assert } = chai;
const util = require("./util");

const MyERC721 = artifacts.require("MyERC721");
const TokenAuction = artifacts.require("TokenAuction");


contract("Testing Auction", async accounts => {

  const name = "Rave Token";
  const symbol = "RAVE";

  const venue = "The Fillmore";
  const artist = "RAC";
  const date = "09/20/18";

  let nft, auctionContract, auction, owner, token;

  const account1 = accounts[1];

  describe("Auction", () => {
    it("should accept nft on creation", async () => {
      const nft = await MyERC721.new(name, symbol);

      const auction = await TokenAuction.new(nft.address);
      const nftAddr = await auction.nonFungibleContract();

      expect(nftAddr).to.equal(nft.address);
    })
  });

  describe("createAuction", () => {

    before(async () => {
      nft = await MyERC721.new(name, symbol);
      auctionContract = await TokenAuction.new(nft.address);
      owner = await nft.owner();

      await nft.mint(venue, artist, date);
      token = await nft.tokenOfOwnerByIndex(owner, 0);

      await nft.approve(auctionContract.address, token, {from: owner});
      auction = await auctionContract.createAuction(token, 100, 1000, owner, {from: owner});
    });

    it("should take ownership of a token", async () => {
      const tokenOwner = await nft.ownerOf(token);
      expect(tokenOwner).to.equal(auctionContract.address);
    });

    it("should create a new auction", async () => {
      const newAuction = await auctionContract.getAuction(token);
      expect(newAuction[0]).to.equal(accounts[0]);
      expect(newAuction[1].toNumber()).to.equal(100);
    });
  })

  describe("auction bid", () => {
    let initialBal0;

    before(async () => {
      nft = await MyERC721.new(name, symbol);
      auctionContract = await TokenAuction.new(nft.address);
      owner = await nft.owner();

      await nft.mint(venue, artist, date);
      token = await nft.tokenOfOwnerByIndex(owner, 0);

      await nft.approve(auctionContract.address, token, {from: owner});
      auction = await auctionContract.createAuction(token, 100, 1000, owner, {from: owner});

      initialBal0 = await util.getBalance(accounts[0]);
      await auctionContract.bid(token, {from: account1, value: 101});
    });

    it("should remove auction", async () => {
      await assertRevert(auctionContract.getAuction(token));
    });

    it("Should transfer money to seller", async () => {
        const balance0 = await util.getBalance(accounts[0]);
        assert.equal(balance0.sub(initialBal0).toNumber(), 100);
    });

    it("Should transfer token to buyer", async () => {
        assert.equal(await nft.ownerOf(token), accounts[1]);
    });
  });

  describe("cancel auction", () => {
    before(async () => {
      nft = await MyERC721.new(name, symbol);
      auctionContract = await TokenAuction.new(nft.address);
      owner = await nft.owner();

      await nft.mint(venue, artist, date);
      token = await nft.tokenOfOwnerByIndex(owner, 0);

      await nft.approve(auctionContract.address, token, {from: owner});
      auction = await auctionContract.createAuction(token, 100, 1000, owner, {from: owner});

      await auctionContract.cancelAuction(token);
    });

    it("should remove auction", async () => {
      await assertRevert(auctionContract.getAuction(token));
    });

    it("Should transfer token back to seller", async () => {
        assert.equal(await nft.ownerOf(token), accounts[0]);
    });
  })

});
